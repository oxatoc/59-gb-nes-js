import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsEntity } from './comments.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from '../news.entity';
import { UsersModule } from '../../users/users.module';
import { UsersEntity } from '../../users/users.entity';
import { NewsModule } from '../news.module';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
  imports: [
    UsersModule,
    forwardRef(() => NewsModule),
    TypeOrmModule.forFeature([CommentsEntity, NewsEntity, UsersEntity]),
  ],
})
export class CommentsModule {}
