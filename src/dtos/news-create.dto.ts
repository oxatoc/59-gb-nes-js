import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  IsString,
  ValidateIf,
} from 'class-validator';
import { News } from '../news/news.interface';

export class NewsCreateDto implements News {
  @IsNotEmpty()
  @IsString()
  title = '';

  @IsNotEmpty()
  @IsString()
  description = '';

  @ValidateIf((o) => o.author)
  @IsString()
  author = '';

  @ValidateIf((o) => o.cover)
  @IsString()
  cover = '';

  @IsNotEmpty()
  @IsNumberString()
  authorId = 0;

  @IsNotEmpty()
  @IsNumberString()
  categoryId = 0;

  @IsNotEmpty()
  @IsDateString()
  createdAt = '';
}
