import { Body, Controller, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesEntity } from './categories.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body('name') name: string): Promise<CategoriesEntity> {
    return this.categoriesService.create(name);
  }
}
