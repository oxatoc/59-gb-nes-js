import { Injectable } from '@nestjs/common';
import { CommentsEntity } from './comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from '../news.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
  ) {}

  async create(comment: CommentsEntity) {
    return await this.commentsRepository.save(comment);
  }

  async findById(id: number) {
    return await this.commentsRepository.findOneOrFail({ id });
  }

  async findAll(news: NewsEntity) {
    return await this.commentsRepository.find(news);
  }

  async index() {
    return await this.commentsRepository.find({});
  }

  async remove(id: number) {
    const comments = await this.findById(id);
    return await this.commentsRepository.remove(comments);
  }

  async removeAll(news: NewsEntity) {
    const comments = await this.findAll(news);
    return await this.commentsRepository.remove(comments);
  }

  async update(id: number, comment: CommentsEntity) {
    return await this.commentsRepository.update(id, comment);
  }
}
