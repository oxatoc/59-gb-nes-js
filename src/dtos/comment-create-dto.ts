import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  ValidateIf,
} from 'class-validator';
export class CommentCreateDto {
  @ValidateIf((o) => o.id)
  @IsNumberString()
  id: number;

  @ValidateIf((o) => o.authorId)
  @IsNotEmpty()
  @IsNumberString()
  authorId: number;

  @ValidateIf((o) => o.newsId)
  @IsNotEmpty()
  @IsNumberString()
  newsId: number;

  @IsNotEmpty()
  @IsString()
  message = '';
}
