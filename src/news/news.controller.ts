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
import { htmlTemplate, newsTemplate } from '../views/template';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get('all')
  async getAll(): Promise<News[]> {
    return this.newsService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id): Promise<News | undefined> {
    return this.newsService.findByIndex(id);
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
