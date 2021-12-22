import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from '../dtos/user-create.dto';

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
    userEntity.role = user.role;
    return await this.usersRepository.save(userEntity);
  }

  async findById(id: number) {
    return await this.usersRepository.findOneOrFail({ id });
  }
}
