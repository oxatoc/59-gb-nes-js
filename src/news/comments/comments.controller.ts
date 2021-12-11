import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { NewsComments } from './news-comments.interface';

@Controller('news-comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('all')
  getAll(@Query('idNews') idNews: number): Promise<NewsComments> {
    return this.commentsService.findAll(idNews);
  }

  @Post()
  create(@Query('idNews') idNews, @Body() comment): Promise<number> {
    return this.commentsService.create(idNews, comment);
  }

  @Delete(':id')
  remove(@Query('idNews') idNews, @Param('id') idComment): Promise<boolean> {
    return this.commentsService.remove(idNews, idComment);
  }

  @Delete('all')
  removeAll(@Query('idNews') idNews): Promise<boolean> {
    return this.commentsService.removeAll(idNews);
  }
}
