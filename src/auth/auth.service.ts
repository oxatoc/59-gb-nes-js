import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from '../utils/crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
  async login(user: any) {
    const payload = user;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async verify(token: string) {
    return await this.jwtService.verify(token);
  }
}
