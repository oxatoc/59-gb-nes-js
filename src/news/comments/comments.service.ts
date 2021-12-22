import { Injectable } from '@nestjs/common';
import { Comment } from './comment.interface';
import { CommentsEntity } from './comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsService } from '../news.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    private readonly newsService: NewsService,
  ) {}

  async create(idNews: number, comment: CommentsEntity) {
    return await this.commentsRepository.save(comment);
  }

  async findById(id: number) {
    return await this.commentsRepository.find({ id });
  }

  async findAll(idNews: number) {
    const news = await this.newsService.findById(idNews);
    if (!news) {
      return null;
    }
    return await this.commentsRepository.find(news);
  }

  async index() {
    return await this.commentsRepository.find({});
  }

  async remove(id: number) {
    const comments = await this.findById(id);
    if (!comments) {
      return null;
    }
    return await this.commentsRepository.remove(comments);
  }

  async removeAll(idNews: number) {
    const comments = await this.findAll(idNews);
    if (!comments) {
      return null;
    }
    return await this.commentsRepository.remove(comments);
  }

  async update(id: number, comment: CommentsEntity) {
    return await this.commentsRepository.update(id, comment);
  }
}
