import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsEntity } from './comments.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsService } from '../news.service';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
  imports: [NewsService, TypeOrmModule.forFeature([CommentsEntity])],
})
export class CommentsModule {}
