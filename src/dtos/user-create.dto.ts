import { IsEmail, IsString, ValidateIf } from 'class-validator';

export class UserCreateDto {
  @ValidateIf((o) => o.firstName)
  @IsString()
  firstName: string;

  @ValidateIf((o) => o.lastName)
  @IsString()
  lastName: string;

  @ValidateIf((o) => o.email)
  @IsEmail()
  email: string;

  @ValidateIf((o) => o.password)
  @IsString()
  password: string;

  @ValidateIf((o) => o.roles)
  @IsString()
  roles: string;
}
