import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { NewsComments } from './news-comments.interface';
import { Comment } from './comment.interface';

@Injectable()
export class CommentsService {
  private readonly comments: NewsComments = {};

  async create(idNews: number, comment: Comment): Promise<Comment> {
    if (!this.comments?.[idNews]) {
      this.comments[idNews] = [];
    }

    const commentObj: Comment = { ...comment, ...{ id: uuidv4() } };

    this.comments[idNews].push(commentObj);

    return commentObj;
  }

  async findAll(idNews: number): Promise<Comment[] | undefined> {
    return this.comments?.[idNews];
  }

  async remove(idNews: number, idComment: string): Promise<boolean> {
    const index = this.comments?.[idNews].findIndex((x) => x.id === idComment);
    if (index !== -1) {
      this.comments[idNews].splice(index, 1);
      return true;
    }
    return true;
  }

  async removeAll(idNews: number): Promise<boolean> {
    return delete this.comments?.[idNews];
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
