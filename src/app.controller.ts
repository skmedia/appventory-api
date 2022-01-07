import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
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
