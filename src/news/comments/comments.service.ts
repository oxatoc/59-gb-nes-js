import { Injectable } from '@nestjs/common';
import { CommentsEntity } from './comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from '../news.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    private readonly eventEmitter: EventEmitter2,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async create(comment: CommentsEntity) {
    return await this.commentsRepository.save(comment);
  }

  async findById(id: number) {
    return await this.commentsRepository.findOneOrFail(
      { id },
      { relations: ['news', 'user'] },
    );
  }

  async findAll(news: NewsEntity) {
    const commentKey = 'comments_by_news_' + news.id;
    const cached = await this.redisCacheService.get(commentKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const value = await this.commentsRepository.find({
      where: { news },
      relations: ['user'],
    });
    if (value) {
      await this.redisCacheService.set(commentKey, JSON.stringify(value));
    }
    return value;
  }

  async index() {
    return await this.commentsRepository.find({});
  }

  async remove(id: number) {
    const _comment = await this.findById(id);
    this.eventEmitter.emit('comment.remove', {
      commentId: _comment.id,
      newsId: _comment.news.id,
    });
    return await this.commentsRepository.remove(_comment);
  }

  async removeAll(news: NewsEntity) {
    const comments = await this.findAll(news);
    return await this.commentsRepository.remove(comments);
  }

  async update(id: number, comment: CommentsEntity) {
    const result = await this.commentsRepository.update(id, comment);
    const newComment = await this.findById(id);
    this.eventEmitter.emit('comment.update', {
      newsId: newComment.news.id,
      comment: newComment,
    });
    return result;
  }
}
