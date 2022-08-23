import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
  StreamableFile,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { CurrentAccount } from 'src/auth/auth.decorator';
import { AssetsService } from './assets.service';

@Controller({
  path: 'assets',
  version: '1',
})
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}
  @UseInterceptors(FilesInterceptor('files'))
  @Post('upload')
  async upload(
    @Body('id') id: string,
    @Body('fileDescriptions') fileDescriptions: Array<any>,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    try {
      const result = await this.assetsService.upload(
        id,
        files,
        fileDescriptions,
      );

      return result;
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: e,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get('download/:id')
  async download(
    @CurrentAccount() accountId,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const stream = await this.assetsService.getFileAsStream(id, accountId);
    stream.pipe(res);
    return res;
  }
}
