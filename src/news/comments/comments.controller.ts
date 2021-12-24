import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Render,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentCreateDto } from '../../dtos/comment-create-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileExtensionCheck } from '../../utils/file-extension-check';
import { destinationPathComment } from '../../utils/destination-path-comment';
import { customFileName } from '../../utils/custom-file-name';
import { CommentsEntity } from './comments.entity';
import { UsersService } from '../../users/users.service';
import { NewsService } from '../news.service';

@Controller('news-comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
    private readonly newsService: NewsService,
  ) {}

  @Get()
  @Render('comments-index')
  async index() {
    const comments = await this.commentsService.index();
    return { comments };
  }

  @Get('all')
  async getAll(@Query('idNews') idNews: number) {
    const news = await this.newsService.findById(idNews);
    return this.commentsService.findAll(news);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: destinationPathComment,
        filename: customFileName,
      }),
      fileFilter: fileExtensionCheck,
    }),
  )
  async create(@Body() commentCreateDto: CommentCreateDto) {
    const comment = new CommentsEntity();
    comment.message = commentCreateDto.message;
    comment.user = await this.usersService.findById(commentCreateDto.authorId);
    comment.news = await this.newsService.findById(commentCreateDto.newsId);

    return await this.commentsService.create(comment);
  }

  @Patch(':id')
  async update(
    @Param('id') idComment: number,
    @Body() commentCreateDto: CommentCreateDto,
  ) {
    let comment = await this.commentsService.findById(idComment);
    comment = { ...comment, ...commentCreateDto };
    return this.commentsService.update(idComment, comment);
  }

  @Delete(':id')
  async remove(@Param('id') idComment: number) {
    return this.commentsService.remove(idComment);
  }

  @Delete('all')
  async removeAll(@Query('idNews') idNews: number) {
    const news = await this.newsService.findById(idNews);
    return this.commentsService.removeAll(news);
  }
}
