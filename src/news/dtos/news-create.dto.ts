import {
  IsDateString,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { News } from '../news.interface';

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
  @IsDateString()
  createdAt = '';
}
