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

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Post()
  create(@Body() news: News) {
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
  getNews() {
    return this.newsService.findAll();
  }

  @Get('all')
  index() {
    return this.newsService.findAll();
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
