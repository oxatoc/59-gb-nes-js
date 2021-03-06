import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { CommentsService } from './comments.service';
import { WsJwtGuard } from '../../auth/ws-jwt.guard';
import { CommentsEntity } from './comments.entity';
import { UsersService } from '../../users/users.service';
import { NewsService } from '../news.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Role } from '../../auth/role/role.enum';
import { WsRolesOrUser } from '../../auth/role/ws-roles.decorator';

export type Comment = { idNews: number; message: string };
export type RemovedComment = { commentId: number; newsId: number };
export type UpdatedComment = { newsId: number; comment: CommentsEntity };

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

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('updateComment')
  async handleUpdate(
    client: Socket,
    payload: { idComment: number; message: string },
  ) {
    const commentsEntity = new CommentsEntity();
    commentsEntity.message = payload.message;
    await this.commentsService.update(payload.idComment, commentsEntity);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('removeComment')
  @WsRolesOrUser(Role.Admin)
  async handleRemove(client: Socket, payload: { idComment: number }) {
    await this.commentsService.remove(payload.idComment);
  }

  @OnEvent('comment.remove')
  handleRemoveCommentEvent(payload: RemovedComment) {
    const { commentId, newsId } = payload;
    this.server.to(newsId.toString()).emit('removeComment', { id: commentId });
  }

  @OnEvent('comment.update')
  handleUpdateCommentEvent(payload: UpdatedComment) {
    const { comment, newsId } = payload;
    this.server.to(newsId.toString()).emit('updateComment', { comment });
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
      client.join(newsId.toString()); //подписать клиента на комнату этой новости
    }
    this.logger.log(`Client connected: ${client.id}`);
  }
}
