import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from '../dtos/user-create.dto';
import { hash } from '../utils/crypto';
import { Role } from '../auth/role/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}
  async create(user: UserCreateDto) {
    const userEntity = new UsersEntity();
    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;
    userEntity.email = user.email;

    switch (user.role) {
      case 'user':
        userEntity.roles = Role.User;
        break;
      case 'admin':
        userEntity.roles = Role.Admin;
        break;
      case 'moderator':
        userEntity.roles = Role.Moderator;
        break;
    }
    userEntity.password = await hash(user.password);
    return await this.usersRepository.save(userEntity);
  }

  async findById(id: number) {
    return await this.usersRepository.findOneOrFail({ id });
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ email });
  }

  async setModerator(idUser: number): Promise<UsersEntity> {
    const _user = await this.findById(idUser);
    if (!_user) {
      throw new UnauthorizedException();
    }
    _user.roles = Role.Moderator;
    return this.usersRepository.save(_user);
  }
}
