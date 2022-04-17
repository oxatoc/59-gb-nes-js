import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CommentsService } from './comments/comments.service';
import { NewsIdDto } from '../dtos/news-id.dto';
import { NewsCreateDto } from '../dtos/news-create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { fileExtensionCheck } from '../utils/file-extension-check';
import { MailService } from '../mail/mail.service';
import { customFileName } from '../utils/custom-file-name';
import { destinationPathNews } from '../utils/destination-path-news';
import { NEWS_PATH } from '../types/types';
import { NewsEntity } from './news.entity';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';

@Controller('news')
@UseInterceptors(LoggingInterceptor)
export class NewsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
    private readonly newsService: NewsService,
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
    @Body() newsCreateDto: NewsCreateDto,
    @UploadedFile() cover: Express.Multer.File,
  ) {
    const _newsEntity = new NewsEntity();
    if (cover?.filename?.length > 0) {
      _newsEntity.cover = NEWS_PATH + cover.filename;
    }
    _newsEntity.title = newsCreateDto.title;
    _newsEntity.description = newsCreateDto.description;

    _newsEntity.user = await this.usersService.findById(newsCreateDto.authorId);
    _newsEntity.category = await this.categoriesService.findById(
      newsCreateDto.categoryId,
    );

    const _news = await this.newsService.create(_newsEntity);
    await this.mailService.sendNewNewsForAdmins(['regs@rigtaf.ru'], _news);
    return _news;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() newsCreateDto: NewsCreateDto) {
    let news = await this.newsService.findById(id);
    news = { ...news, ...newsCreateDto };

    const changes = await this.newsService.getChanges(id, news);
    if (changes) {
      await this.mailService.sendChanges(['regs@rigtaf.ru'], changes);
    }

    return await this.newsService.store(id, news);
  }

  @Get('all')
  async getAll() {
    return await this.newsService.findAll();
  }

  @Get('creators-rating')
  async getCreatorsRating() {
    return await this.newsService.getCreatorsRating();
  }

  @Get('users/:id')
  async getByUser(@Param('id') id: number) {
    const user = await this.usersService.findById(id);
    return await this.newsService.findByUser(user);
  }

  @Get(':id')
  async getById(@Param() params: NewsIdDto) {
    return await this.newsService.findById(params.id);
  }

  @Get(':id/comments/create')
  @Render('comment-create')
  getNewCommentForm(@Param('id') idNews: number) {
    return { idNews };
  }

  @Get(':id/detail')
  @Render('news-details')
  async getDetailById(@Param('id') idNews: number) {
    const news = await this.newsService.findById(idNews);
    const comments = await this.commentsService.findAll(news);
    return { news, comments };
  }

  @Delete(':id')
  async delete(@Param('id') newsId: number) {
    const news = await this.newsService.findById(newsId);

    const comments = await this.commentsService.removeAll(news);
    await this.newsService.delete(news);

    return { news, comments };
  }

  @Get()
  @Render('news-list')
  async getViewAll() {
    const news = this.newsService.findAll();
    return { newsItems: news };
  }
}
