import { Comment } from '../news/comments/comment.interface';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  ValidateIf,
} from 'class-validator';
export class CommentCreateDto implements Comment {
  @ValidateIf((o) => o.id)
  @IsString()
  id = '';

  @IsNotEmpty()
  @IsNumberString()
  authorId: number;

  @IsNotEmpty()
  @IsNumberString()
  newsId: number;

  @IsString()
  comment = '';

  @ValidateIf((o) => o.avatar)
  @IsString()
  avatar = '';
}
