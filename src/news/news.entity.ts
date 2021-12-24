import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CategoriesEntity } from '../categories/categories.entity';
import { UsersEntity } from '../users/users.entity';
import { CommentsEntity } from './comments/comments.entity';

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
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => CategoriesEntity, (category) => category.news)
  category: CategoriesEntity;

  @ManyToOne(() => UsersEntity, (user) => user.news)
  user: UsersEntity;

  @OneToMany(() => CommentsEntity, (comments) => comments.news)
  comments: CommentsEntity[];
}
