import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const checkPassword = await compare(pass, user.password);

    if (checkPassword) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async validateUserFromJwt(id: string): Promise<any> {
    const user = await this.usersService.findById(id);

    if (!user) {
      return null;
    }

    return { id: user.id, accountId: user.accountId };
  }

  async login(user: any) {
    const payload = {
      username: user.email,
      sub: user.id,
      account: user.accountId,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
