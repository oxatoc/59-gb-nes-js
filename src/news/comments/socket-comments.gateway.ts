import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import * as cookie from 'cookie';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { CommentsService } from './comments.service';
import { WsJwtGuard } from '../../auth/ws-jwt.guard';
import { CommentsEntity } from './comments.entity';
import { UsersService } from '../../users/users.service';
import { NewsService } from '../news.service';
import { OnEvent } from '@nestjs/event-emitter';

export type Comment = { idNews: number; name: string; message: string };
export type RemovedComment = { commentId: number; newsId: number };

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class SocketCommentsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  // создали сервер
  @WebSocketServer() server: Server;

  constructor(
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
    private readonly newsService: NewsService,
  ) {}

  private logger: Logger = new Logger('AppGateway');

  // подписались на сообщения клиентов с типом 'addComment'
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('addComment')
  async handleMessage(client: Socket, comment: Comment) {
    const { idNews, message } = comment;
    const userId: number = client.data.user.id;

    const user = await this.usersService.findById(userId);
    const news = await this.newsService.findById(idNews);
    const commentsEntity = new CommentsEntity();
    commentsEntity.user = user;
    commentsEntity.news = news;
    commentsEntity.message = message;

    const _comment = await this.commentsService.create(commentsEntity);
    this.server.to(idNews.toString()).emit('newComment', _comment);
  }

  @OnEvent('comment.remove')
  handleRemoveCommentEvent(payload: RemovedComment) {
    const { commentId, newsId } = payload;
    this.server.to(newsId.toString()).emit('removeComment', { id: commentId });
  }

  // событие срабатывает после инициализации сервера
  afterInit(server: Server) {
    this.logger.log('Init websocket server');
  }

  // событие срабатывает после каждого отключения клиента
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  // событие срабатывает после каждого подключения клиента
  handleConnection(client: Socket, ...args: any[]) {
    const { newsId } = client.handshake.query;
    if (newsId) {
      client.join(newsId.toString());
    }
    this.logger.log(`Client connected: ${client.id}`);
  }
}
