import { Injectable } from '@nestjs/common';
import { CommentsEntity } from './comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from '../news.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(comment: CommentsEntity) {
    return await this.commentsRepository.save(comment);
  }

  async findById(id: number) {
    return await this.commentsRepository.findOneOrFail(
      { id },
      { relations: ['news'] },
    );
  }

  async findAll(news: NewsEntity) {
    return await this.commentsRepository.find({
      where: { news },
      relations: ['user'],
    });
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
      commentId: newComment.id,
      newsId: newComment.news.id,
    });
    return result;
  }
}
