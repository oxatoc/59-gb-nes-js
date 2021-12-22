import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './news.entity';
import { CategoriesEntity } from '../categories/categories.entity';
import { UsersService } from '../users/users.service';
import { UsersEntity } from '../users/users.entity';
import { CategoriesService } from '../categories/categories.service';

@Module({
  controllers: [NewsController],
  providers: [NewsService, UsersService, CategoriesService],
  imports: [
    CommentsModule,
    MailModule,
    TypeOrmModule.forFeature([NewsEntity, CategoriesEntity, UsersEntity]),
  ],
})
export class NewsModule {}
