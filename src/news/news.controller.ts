import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Render,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './news.interface';
import { CommentsService } from './comments/comments.service';
import { NewsIdDto } from '../dtos/news-id.dto';
import { NewsCreateDto } from '../dtos/news-create.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { fileExtensionCheck } from '../utils/file-extension-check';
import { MailService } from '../mail/mail.service';
import { customFileName } from '../utils/custom-file-name';
import { destinationPathNews } from '../utils/destination-path-news';
import { NEWS_PATH } from '../types/types';
import { NewsEntity } from './news.entity';

@Controller('news')
@UseInterceptors(LoggingInterceptor)
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
    private readonly mailService: MailService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: destinationPathNews,
        filename: customFileName,
      }),
      fileFilter: fileExtensionCheck,
    }),
  )
  async create(
    @Body() news: NewsCreateDto,
    @UploadedFile() cover: Express.Multer.File,
  ): Promise<NewsEntity> {
    const _newsEntity = new NewsEntity();
    if (cover?.filename?.length > 0) {
      _newsEntity.cover = NEWS_PATH + cover.filename;
    }
    _newsEntity.title = news.title;
    _newsEntity.description = news.description;

    const _news = await this.newsService.create(_newsEntity);
    await this.mailService.sendNewNewsForAdmins(['regs@rigtaf.ru'], _news);
    return _news;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() news: News) {
    const newsItem = this.newsService.findByIndex(id);

    if (!newsItem) {
      throw new HttpException(
        `error: news id = ${id} not found`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const changes = await this.newsService.getChanges(id, news);
    if (changes) {
      await this.mailService.sendChanges(['regs@rigtaf.ru'], changes);
    }

    return this.newsService.store(news);
  }

  @Get('all')
  async getAll(): Promise<NewsEntity[]> {
    return await this.newsService.findAll();
  }

  @Get(':id')
  async getById(@Param() params: NewsIdDto): Promise<News | null> {
    return this.newsService.findByIndex(params.id);
  }

  @Get(':id/comments/create')
  @Render('comment-create')
  getNewCommentForm(@Param('id') idNews: number) {
    return { idNews };
  }

  @Get(':id/detail')
  @Render('news-details')
  async getDetailById(@Param('id') idNews: number) {
    return Promise.all([
      this.newsService.findByIndex(idNews),
      this.commentsService.findAll(idNews),
    ]).then((values) => {
      const newsItem = values[0];
      const newsComments = values[1];
      return { news: newsItem, comments: newsComments };
    });
  }

  @Delete(':id')
  async delete(@Param() params: NewsIdDto) {
    const newsItem = this.newsService.findByIndex(params.id);
    if (!newsItem) {
      throw new HttpException(
        `error: news id = ${params.id} not found`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return (
      this.newsService.delete(params.id) &&
      this.commentsService.removeAll(params.id)
    );
  }

  @Get()
  @Render('news-list')
  async getViewAll() {
    const news = this.newsService.findAll();
    return { newsItems: news };
  }
}
