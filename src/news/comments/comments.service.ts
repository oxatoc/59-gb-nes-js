import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { NewsComments } from './news-comments.interface';

@Injectable()
export class CommentsService {
  private readonly comments: NewsComments[] = [];

  async create(idNews: string, comment: string): Promise<number> {
    if (!this.comments?.[idNews]) {
      this.comments[idNews] = [];
    }

    return this.comments[idNews].push({
      comment,
      id: uuidv4(),
    });
  }

  async findAll(idNews: number): Promise<NewsComments | undefined> {
    return this.comments?.[idNews];
  }

  async remove(idNews: string, idComment: string): Promise<boolean> {
    const index = this.comments?.[idNews].findIndex((x) => x.id === idComment);
    if (index !== -1) {
      this.comments[idNews].splice(index, 1);
      return true;
    }
    return true;
  }

  async removeAll(idNews: string): Promise<boolean> {
    return delete this.comments?.[idNews];
  }
}
