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
import { emptyNews, htmlTemplate, newsTemplate } from '../views/template';
import { templateDetail } from '../views/template-detail';
import { CommentsService } from './comments/comments.service';
import { NewsIdDto } from '../dtos/news-id.dto';
import { NewsCreateDto } from '../dtos/news-create.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { fileExtensionCheck } from '../utils/file-extension-check';
import { NewsHelperFileLoader } from '../classes/helper-file-loader/NewsHelperFileLoader';
import { MailService } from '../mail/mail.service';

const newsHelperFileLoader = new NewsHelperFileLoader();

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
    FilesInterceptor('cover', 1, {
      storage: diskStorage({
        destination: newsHelperFileLoader.destinationPath,
        filename: newsHelperFileLoader.customFileName,
      }),
      fileFilter: fileExtensionCheck,
    }),
  )
  async create(
    @Body() news: NewsCreateDto,
    @UploadedFiles() cover: Express.Multer.File[],
  ): Promise<News> {
    let coverPath;
    const coverItem = cover[0];

    if (coverItem?.filename.length > 0) {
      coverPath = newsHelperFileLoader.path + coverItem.filename;
    }

    const _news = this.newsService.create({ ...news, cover: coverPath });
    await this.mailService.sendNewNewsForAdmins(['regs@rigtaf.ru'], _news);

    return this.newsService.create({ ...news, ...{ cover: coverPath } });
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
    return this.newsService.store(news);
  }

  @Get('all')
  async getAll(): Promise<News[]> {
    return this.newsService.findAll();
  }

  @Get(':id')
  async getById(@Param() params: NewsIdDto): Promise<News | null> {
    return this.newsService.findByIndex(params.id);
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
    return { news };
  }
}
