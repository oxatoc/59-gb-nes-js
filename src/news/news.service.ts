import { Injectable } from '@nestjs/common';
import { News } from '../news.interface';

@Injectable()
export class NewsService {
  private readonly news: News[] = [];

  create(news: News): number {
    return this.news.push(news);
  }

  findAll(): News[] {
    return this.news;
  }

  findByIndex(index: number): News | null {
    console.assert(
      typeof this.news[index] !== 'undefined',
      '[findByIndex] Invalid',
    );
    if (typeof this.news[index] !== 'undefined') {
      return this.news[index];
    }

    return null;
  }
}
