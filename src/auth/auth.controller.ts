import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Logger,
  UnauthorizedException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';
import { UsersService } from 'src/users/users.service';
import { UserAccountsService } from 'src/user-accounts/user-accounts.service';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userAccountsService: UserAccountsService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    const account = req.body?.account;

    if (!account) {
      throw new UnauthorizedException();
    }

    const userAccount = await this.userAccountsService.findByUserIdAndAccountId(
      req.user.id,
      account,
    );

    if (!userAccount) {
      throw new UnauthorizedException();
    }

    return this.authService.loginForAccount(req.user, account);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/account')
  async account(@Request() req) {
    return this.userAccountsService.findByUserId(req.user.id);
  }

  @Post('auth/logout')
  async logout(@Request() req) {
    return 'ok';
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/user')
  getProfile(@Request() req, @Res() res: Response) {
    res.status(HttpStatus.OK).json({ user: req.user });
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth/switch-account')
  switchAccount(@Request() req) {
    return this.authService.loginForAccount(req.user, req.body.account);
  }
}
