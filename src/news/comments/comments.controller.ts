import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
import { Comment } from './comment.interface';
import { CommentCreateDto } from '../../dtos/comment-create-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { IdNewsDto } from '../../dtos/id-news-dto';
import { fileExtensionCheck } from '../../utils/file-extension-check';
import { destinationPathComment } from '../../utils/destination-path-comment';
import { customFileName } from '../../utils/custom-file-name';
import { AVATARS_PATH } from '../../types/types';
import { CommentsEntity } from './comments.entity';
import { UsersService } from '../../users/users.service';
import { NewsService } from '../news.service';

@Controller('news-comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
  ) {} // private readonly newsService: NewsService, // , // ,

  @Get()
  @Render('comments-index')
  async index() {
    const comments = await this.commentsService.index();
    return { comments };
  }

  // @Get('all')
  // getAll(@Query('idNews') idNews: number) {
  //   return this.commentsService.findAll(idNews);
  // }

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
  async create(
    // @Query() params: IdNewsDto,
    @Body() commentCreateDto: CommentCreateDto,
  ) {
    const comment = new CommentsEntity();
    comment.message = commentCreateDto.comment;
    comment.user = await this.usersService.findById(commentCreateDto.authorId);
    // comment.news = await this.newsService.findById(commentCreateDto.newsId);

    return await this.commentsService.create(comment);
  }

  @Patch(':id')
  async update(
    @Param('id') idComment: number,
    @Body() commentCreateDto: CommentCreateDto,
  ) {
    const comment = new CommentsEntity();
    comment.message = commentCreateDto.comment;
    comment.user = await this.usersService.findById(commentCreateDto.authorId);
    // comment.news = await this.newsService.findById(commentCreateDto.newsId);
    return this.commentsService.update(idComment, comment);
  }

  @Delete(':id')
  async remove(@Param('id') idComment: number) {
    return this.commentsService.remove(idComment);
  }

  @Delete('all')
  async removeAll(@Query('idNews') idNews: number) {
    return this.commentsService.removeAll(idNews);
  }
}
