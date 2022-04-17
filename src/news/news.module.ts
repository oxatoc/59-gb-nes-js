import { forwardRef, Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './news.entity';
import { UsersModule } from '../users/users.module';
import { CategoriesModule } from '../categories/categories.module';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [
    forwardRef(() => CommentsModule),
    UsersModule,
    CategoriesModule,
    MailModule,
    TypeOrmModule.forFeature([NewsEntity]),
    RedisCacheModule,
  ],
  exports: [NewsService],
})
export class NewsModule {}
