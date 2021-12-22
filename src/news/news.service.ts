import { Injectable } from '@nestjs/common';
import { News } from './news.interface';
import { NewsChange } from './news-change';
import { NewsChanges } from './news-changes';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './news.entity';

@Injectable()
export class NewsService {
  // private readonly news: News[] = [];

  constructor(
    private configService: ConfigService,
    @InjectRepository(NewsEntity)
    private newsRepository: Repository<NewsEntity>,
  ) {
    // const news: News = {
    //   id: 1,
    //   title: 'news1',
    //   description: 'description1',
    //   author: 'author1',
    //   createdAt: '2021-01-01 00:00:00',
    //   cover: '',
    // };
    // this.news.push(news);
  }

  async create(news: NewsEntity) {
    return await this.newsRepository.save(news);
  }

  async delete(id: number) {
    const news = await this.findById(id);
    if (!news) {
      return news;
    }
    return this.newsRepository.remove(news);
  }

  async findAll(): Promise<NewsEntity[]> {
    return await this.newsRepository.find({});
  }

  async findById(id: number) {
    return await this.newsRepository.findOne({ id });
  }

  async remove(id: number) {
    const _news = await this.findById(id);
    if (!_news) {
      return null;
    }
    return await this.newsRepository.remove(_news);
  }

  async getChanges(id: number, news: NewsEntity) {
    const storedNews = await this.findById(id);

    if (!storedNews) {
      return null;
    }

    const previousNews: { [index: string]: any } = storedNews;

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

  async store(id: number, news: NewsEntity) {
    return await this.newsRepository.update(id, news);
  }
}
