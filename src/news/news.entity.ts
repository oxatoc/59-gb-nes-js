import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { CategoriesEntity } from '../categories/categories.entity';
import { UsersEntity } from '../users/users.entity';

@Entity('news')
export class NewsEntity {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column('text')
  title = '';

  @Column('text')
  description = '';

  @Column('text', { nullable: true })
  cover = '';

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date = new Date();

  // @ManyToOne(() => CategoriesEntity, (category) => category.news)
  // category: CategoriesEntity = new CategoriesEntity();

  // @ManyToOne(() => UsersEntity, (user) => user.news)
  // user: UsersEntity = new UsersEntity();
}
