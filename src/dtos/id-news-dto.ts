import { IsNumberString } from 'class-validator';

export class IdNewsDto {
  @IsNumberString()
  idNews = 0;
}
