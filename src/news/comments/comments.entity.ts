import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UsersEntity } from '../../users/users.entity';

@Entity('comments')
export class CommentsEntity {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column('text')
  message = '';

  @ManyToOne(() => UsersEntity, (user) => user.comments)
  user: UsersEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date = new Date();
}
