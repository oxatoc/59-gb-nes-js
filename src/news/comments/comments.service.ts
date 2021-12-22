import { Injectable } from '@nestjs/common';
import { Comment } from './comment.interface';
import { CommentsEntity } from './comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from '../news.entity';
import { CommentCreateDto } from '../../dtos/comment-create-dto';
import { UsersEntity } from '../../users/users.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async create(commentCreateDto: CommentCreateDto) {
    const comment = new CommentsEntity();
    comment.message = commentCreateDto.comment;
    comment.user = await this.usersRepository.findOneOrFail(
      commentCreateDto.authorId,
    );
    comment.news = await this.newsRepository.findOneOrFail(
      commentCreateDto.newsId,
    );

    return await this.commentsRepository.save(comment);
  }

  async findById(id: number) {
    return await this.commentsRepository.find({ id });
  }

  async findAll(idNews: number) {
    const news = await this.newsRepository.findOneOrFail({ id: idNews });
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

  async update(id: number, commentCreateDto: CommentCreateDto) {
    const comment = new CommentsEntity();
    comment.message = commentCreateDto.comment;
    comment.user = await this.usersRepository.findOneOrFail(
      commentCreateDto.authorId,
    );
    comment.news = await this.newsRepository.findOneOrFail(
      commentCreateDto.newsId,
    );
    return await this.commentsRepository.update(id, comment);
  }
}
