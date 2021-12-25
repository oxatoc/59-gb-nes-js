import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { NewsEntity } from '../news/news.entity';
import { CommentsEntity } from '../news/comments/comments.entity';
import { IsEnum } from 'class-validator';
import { Role } from '../auth/role/role.enum';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column('text')
  firstName = '';

  @Column('text')
  lastName = '';

  @Column('text')
  email = '';

  @Column('text')
  role = '';

  @Column('text')
  password = '';

  @Column('text')
  @IsEnum(Role)
  roles: Role;

  @OneToMany(() => NewsEntity, (news) => news.user)
  news: NewsEntity[];

  @OneToMany(() => CommentsEntity, (comments) => comments.user)
  comments: CommentsEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date = new Date();
}
