import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ApplicationAssetsService } from './application-assets.service';
import { Application as ApplicationModel } from '@prisma/client';
import { CurrentAccount } from 'src/auth/auth.decorator';
import SaveDto from './dto/save.dto';
import { ApplicationsService } from 'src/applications/applications.service';

@Controller({
  path: 'applications',
  version: '1',
})
export class ApplicationAssetsController {
  constructor(
    private readonly applicationAssetsService: ApplicationAssetsService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Put('/:id/assets')
  async saveAssets(
    @Param('id') id: string,
    @Body() data: SaveDto,
    @CurrentAccount() accountId,
  ): Promise<ApplicationModel> {
    const application = await this.applicationsService.findById(id);
    if (!application || application.accountId !== accountId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'application not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return this.applicationAssetsService.save(application, data);
  }
}
