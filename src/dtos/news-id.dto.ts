import { IsNotEmpty, IsString } from 'class-validator';

export class NewsIdDto {
  @IsString()
  @IsNotEmpty()
  id = 0;
}
