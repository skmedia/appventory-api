import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { UserAccountsService } from 'src/user-accounts/user-accounts.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private userAccountsService: UserAccountsService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const validPassword = await compare(pass, user.password);

    if (validPassword) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async validateUserFromJwt(id: string, accountId: string): Promise<any> {
    const userAccount = await this.userAccountsService.findByUserIdAndAccountId(
      id,
      accountId,
    );

    if (!userAccount) {
      return null;
    }

    const user = userAccount.user;

    return {
      id: user.id,
      activeAccount: userAccount.account,
      accounts: user.userAccounts.map(({ account }) => account),
      name: user.firstName + ' ' + user.lastName,
      initials: user.firstName.charAt(0) + user.lastName.charAt(0),
    };
  }

  async loginForAccount(user: any, accountId: string) {
    const payload = {
      username: user.email,
      sub: user.id,
      account: accountId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
