import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';
export class CommentCreateDto {
  @IsNotEmpty()
  @IsNumberString()
  id: number;

  @IsNotEmpty()
  @IsNumberString()
  authorId: number;

  @IsNotEmpty()
  @IsNumberString()
  newsId: number;

  @IsString()
  comment = '';
}
