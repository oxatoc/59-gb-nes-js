import { Injectable } from '@nestjs/common';
import { News } from './news.interface';
import { NewsChange } from './news-change';
import { NewsChanges } from './news-changes';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NewsService {
  private readonly news: News[] = [];

  constructor(private configService: ConfigService) {
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
    console.log('config', this.configService.get<string>('SMTP_HOST'));
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

  async getChanges(id: number, news: News): Promise<NewsChanges | null> {
    const previousNews: { [index: string]: any } = (await this.findByIndex(
      id,
    )) as News;

    if (!previousNews) {
      return null;
    }

    const actualNews: { [index: string]: any } = news;

    const changes = [];
    const captions: { [index: string]: string } = {
      title: 'Заголовок',
      description: 'Описание',
      author: 'Автор',
      cover: 'Изображение',
      createdAt: 'Создано',
    };

    for (const key in previousNews) {
      const change = new NewsChange();
      change.previousValue = previousNews[key];
      change.actualValue = actualNews[key];
      if (change.actualValue && actualNews[key] !== previousNews[key]) {
        change.fieldName = key;
        change.fieldCaption = captions[key];
        changes.push(change);
      }
    }
    if (changes.length > 0) {
      const changesItem = new NewsChanges();
      changesItem.id = previousNews.id;
      changesItem.changes = changes;
      return changesItem;
    }
    return null;
  }

  store(values: News): News {
    const index = this.news.findIndex((item) => item.id === values.id);
    this.news[index] = { ...this.news[index], ...values };
    return this.news[index];
  }
}
