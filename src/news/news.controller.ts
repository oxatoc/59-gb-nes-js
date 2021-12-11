import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './news.interface';
import { emptyNews, htmlTemplate, newsTemplate } from '../views/template';
import { templateDetail } from '../views/template-detail';
import { CommentsService } from './comments/comments.service';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Get('all')
  async getAll(): Promise<News[]> {
    return this.newsService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<News | null> {
    return this.newsService.findByIndex(id);
  }

  @Get(':id/detail')
  async getDetailById(@Param('id') idNews: number): Promise<string> {
    return Promise.all([
      this.newsService.findByIndex(idNews),
      this.commentsService.findAll(idNews),
    ]).then((values) => {
      const newsItem = values[0];
      const newsComments = values[1];
      if (newsItem == null) {
        return emptyNews();
      }
      if (newsComments == null) {
        return templateDetail(newsItem, []);
      }
      return templateDetail(newsItem, newsComments);
    });
  }

  @Post()
  async create(@Body() news: News): Promise<News> {
    return this.newsService.create(news);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    const newsItem = this.newsService.findByIndex(id);
    if (!newsItem) {
      throw new HttpException(
        `error: news id = ${id} not found`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return this.newsService.delete(id);
  }

  @Get()
  async getViewAll(): Promise<string> {
    const news = this.newsService.findAll();
    return htmlTemplate(newsTemplate(news));
  }

  @Post(':id')
  async update(@Param('id') id: number, @Body() news: News) {
    const newsItem = this.newsService.findByIndex(id);

    if (!newsItem) {
      throw new HttpException(
        `error: news id = ${id} not found`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return this.newsService.store(news);
  }
}
