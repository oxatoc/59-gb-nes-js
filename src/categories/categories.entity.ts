import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { NewsEntity } from '../news/news.entity';

@Entity('categories')
export class CategoriesEntity {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column('text')
  name = '';

  // @OneToMany(() => NewsEntity, (news) => news.category)
  // news: NewsEntity[] = [];
}
