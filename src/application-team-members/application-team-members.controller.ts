import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ApplicationTeamMembersService } from './application-team-members.service';
import { Application as ApplicationModel } from '@prisma/client';
import { CurrentAccount } from 'src/auth/auth.decorator';
import SaveDto from './dto/save.dto';
import { ApplicationsService } from 'src/applications/applications.service';

@Controller({
  path: 'applications',
  version: '1',
})
export class ApplicationTeamMembersController {
  constructor(
    private readonly applicationTeamMembersService: ApplicationTeamMembersService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Put('/:id/team-members')
  async saveTeamMembers(
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

    return this.applicationTeamMembersService.save(application, data);
  }
}
