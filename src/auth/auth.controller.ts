import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('auth/logout')
  async logout(@Request() req) {
    return 'ok';
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/user')
  getProfile(@Request() req) {
    return { user: req.user };
  }
}
