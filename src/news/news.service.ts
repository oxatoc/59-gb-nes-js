import { Injectable } from '@nestjs/common';
import { NewsChange } from './news-change';
import { NewsChanges } from './news-changes';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
  ) {}

  async create(news: NewsEntity) {
    return await this.newsRepository.save(news);
  }

  async delete(id: number) {
    const news = await this.findById(id);
    if (!news) {
      return news;
    }
    return await this.newsRepository.remove(news);
  }

  async findAll() {
    return await this.newsRepository.find({});
  }

  async findById(id: number) {
    return await this.newsRepository.findOneOrFail({ id });
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
