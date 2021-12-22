import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { NewsComments } from './news-comments.interface';
import { Comment } from './comment.interface';
import { CommentsEntity } from './comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  // private readonly comments: NewsComments = {};

  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
  ) {}

  async create(idNews: number, comment: Comment): Promise<Comment> {
    if (!this.comments?.[idNews]) {
      this.comments[idNews] = [];
    }

    const commentObj: Comment = { ...comment, ...{ id: uuidv4() } };

    this.comments[idNews].push(commentObj);

    return commentObj;
  }

  async findAll(idNews: number) {
    return await this.commentsRepository.find({ news: idNews });
  }

  async index() {
    let comments: Comment[] = [];
    for (const idNews in this.comments) {
      const newsComments = this.comments[idNews];
      comments = [...comments, ...newsComments];
    }
    return comments;
  }

  async remove(idNews: number, idComment: string): Promise<boolean> {
    const index = this.comments?.[idNews].findIndex((x) => x.id === idComment);
    if (index !== -1) {
      this.comments[idNews].splice(index, 1);
      return true;
    }
    return true;
  }

  async removeAll(idNews: number) {
    const comments = this.findAll(idNews);
    return await this.commentsRepository.remove(comments);
  }

  async update(idComment: string, comment: Comment): Promise<Comment | null> {
    const newsKeys: string[] = Object.keys(this.comments);
    let index = -1;

    let iKey = 0;
    while (iKey < newsKeys.length) {
      const key = +newsKeys[iKey++];
      const comments = this.comments[key];
      index = comments.findIndex((item) => item.id === idComment);
      if (index >= 0) {
        let commentItem = this.comments[key][index];
        commentItem = { ...commentItem, ...comment };
        this.comments[key][index] = commentItem;
        return commentItem;
      }
    }
    return null;
  }
}
