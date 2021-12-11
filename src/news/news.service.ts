import { Injectable } from '@nestjs/common';
import { News } from './news.interface';

@Injectable()
export class NewsService {
  private readonly news: News[] = [];

  constructor() {
    const news: News = {
      id: 1,
      title: 'news1',
      description: 'description1',
      author: 'author1',
      createdAt: new Date('2021-01-01 00:00:00'),
    };
    this.news.push(news);
  }

  create(news: News): News {
    const id = Math.round(Math.random() * 10000) + 1;
    const createdAt = new Date();
    const newsItem = { ...news, id, createdAt };
    this.news.push(newsItem);
    return newsItem;
  }

  delete(id: number): News {
    const index = this.news.findIndex((news) => news.id === id);
    return this.news.splice(index, 1)[0];
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

  store(values: News): News {
    const index = this.news.findIndex((item) => item.id === values.id);
    this.news[index] = { ...this.news[index], ...values };
    return this.news[index];
  }
}
