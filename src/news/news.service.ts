import { Injectable } from '@nestjs/common';
import { NewsChange } from './news-change';
import { NewsChanges } from './news-changes';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './news.entity';
import { UsersEntity } from '../users/users.entity';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async create(news: NewsEntity) {
    this.redisCacheService.addCreatorScore(news.user.id);
    return await this.newsRepository.save(news);
  }

  async delete(news: NewsEntity) {
    return await this.newsRepository.remove(news);
  }

  async findAll() {
    return await this.newsRepository.find({});
  }

  async findById(id: number): Promise<NewsEntity> {
    const newsKey = 'news_' + id;
    const cached = await this.redisCacheService.get(newsKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const value = await this.newsRepository.findOneOrFail({ id });
    if (value) {
      await this.redisCacheService.set(newsKey, JSON.stringify(value));
    }

    return value;
  }

  async findByUser(user: UsersEntity) {
    return await this.newsRepository.find({ user });
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

  async getCreatorsRating() {
    return this.redisCacheService.getCreatorsRating();
  }

  async store(id: number, news: NewsEntity) {
    return await this.newsRepository.update(id, news);
  }
}
