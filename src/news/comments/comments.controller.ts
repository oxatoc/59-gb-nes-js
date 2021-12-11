import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comment.interface';

@Controller('news-comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('all')
  getAll(@Query('idNews') idNews: number): Promise<Comment[] | undefined> {
    return this.commentsService.findAll(idNews);
  }

  @Post()
  create(
    @Query('idNews') idNews: number,
    @Body() comment: Comment,
  ): Promise<Comment> {
    return this.commentsService.create(idNews, comment);
  }

  @Patch(':id')
  update(@Param('id') idComment: string, @Body() comment: Comment) {
    return this.commentsService.update(idComment, comment);
  }

  @Delete(':id')
  remove(
    @Query('idNews') idNews: number,
    @Param('id') idComment: string,
  ): Promise<boolean> {
    return this.commentsService.remove(idNews, idComment);
  }

  @Delete('all')
  removeAll(@Query('idNews') idNews: number): Promise<boolean> {
    return this.commentsService.removeAll(idNews);
  }
}
