import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateDto } from '../dtos/user-create.dto';
import { UsersEntity } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: UserCreateDto): Promise<UsersEntity> {
    return this.usersService.create(user);
  }
}
