import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesEntity } from './categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private readonly categoriesRepository: Repository<CategoriesEntity>,
  ) {}
  async create(name: string) {
    return await this.categoriesRepository.save({ name });
  }

  async findById(id: number) {
    return await this.categoriesRepository.findOne({ id });
  }
}
