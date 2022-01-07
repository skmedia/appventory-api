import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { Application as ApplicationModel } from '@prisma/client';
import AddApplicationDto from './dto/add-application.dto';
import UpdateApplicationDto from './dto/update-application.dto';
import DataTableOptionsDto from './dto/data-table-options.dto';

@Controller({
  path: 'applications',
  version: '1',
})
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}
  @Get()
  async getList(@Query() dataTableOptions: DataTableOptionsDto) {
    const count = await this.applicationsService.count(dataTableOptions);
    const items = await this.applicationsService.getList(dataTableOptions);
    return {
      items: items,
      meta: {
        count: count,
      },
    };
  }
  @Get('/:id')
  async getApplication(@Param('id') id: string) {
    const application = await this.applicationsService.findById(id);
    if (!application) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'application not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return application;
  }
  @Post('')
  async addApplication(
    @Body() data: AddApplicationDto,
  ): Promise<ApplicationModel> {
    return this.applicationsService.createApplication(data);
  }
  @Put('/:id')
  async updateApplication(
    @Param('id') id: string,
    @Body() data: UpdateApplicationDto,
  ): Promise<ApplicationModel> {
    const application = await this.applicationsService.findById(id);
    if (!application) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'application not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return this.applicationsService.updateApplication(application, data);
  }
  @Delete(':id')
  async deleteApplication(@Param('id') id: string): Promise<ApplicationModel> {
    const application = await this.applicationsService.findById(id);
    if (!application) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'application not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.applicationsService.deleteApplication(application.id);
  }
}
