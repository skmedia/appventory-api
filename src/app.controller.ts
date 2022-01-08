import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from './auth/auth.decorator';

@Controller()
export class AppController {
  @Public()
  @Get('/ping')
  ping(@Res() res: Response) {
    return res
      .json({
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
      })
      .status(HttpStatus.OK);
  }
}
