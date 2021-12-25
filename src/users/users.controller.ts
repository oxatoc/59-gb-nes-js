import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Render,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateDto } from '../dtos/user-create.dto';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get(':id/edit')
  @Render('user-edit')
  async edit(@Param('id') idUser: number) {
    return { idUser };
  }

  @Get('/web-api/:id/edit')
  @Roles(Role.User)
  @Render('user-edit-form')
  async show(@Param('id') idUser: number) {
    const user = await this.usersService.findById(idUser);
    return { user, layout: false };
  }

  @Post()
  async create(@Body() user: UserCreateDto) {
    return await this.usersService.create(user);
  }

  @Patch(':id')
  @Roles(Role.User)
  async store(
    @Param('id') idUser: number,
    @Body() userCreateDto: UserCreateDto,
  ) {
    return await this.usersService.store(idUser, userCreateDto);
  }
}
