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
      createdAt: '2021-01-01 00:00:00',
      cover: '',
    };
    this.news.push(news);
  }

  create(news: News): News {
    const id = Math.round(Math.random() * 10000) + 1;
    const newsItem = { ...news, id };
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

  async findByIndex(idNews: number): Promise<News | null> {
    const found = this.news.find((item) => {
      return item.id === +idNews;
    });

    console.assert(typeof found !== 'undefined', '[findByIndex] Invalid');
    if (typeof found !== 'undefined') {
      return found;
    }

    return null;
  }

  store(values: News): News {
    const index = this.news.findIndex((item) => item.id === values.id);
    this.news[index] = { ...this.news[index], ...values };
    return this.news[index];
  }
}
