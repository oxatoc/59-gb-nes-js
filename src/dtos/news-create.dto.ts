import {
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

  @ValidateIf((o) => o.cover)
  @IsString()
  cover = '';

  @ValidateIf((o) => o.authorId)
  @IsNumberString()
  authorId = 0;

  @ValidateIf((o) => o.categoryId)
  @IsNumberString()
  categoryId = 0;
}
