import { Comment } from '../news/comments/comment.interface';
import { IsNumber, IsString, ValidateIf } from 'class-validator';
export class CommentCreateDto implements Comment {
  @ValidateIf((o) => o.id)
  @IsString()
  id = '';

  @IsString()
  comment = '';

  @ValidateIf((o) => o.avatar)
  @IsString()
  avatar = '';
}
