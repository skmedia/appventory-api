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
import { Client } from '@prisma/client';
import {
  AddClientDto,
  UpdateClientDto,
  DataTableOptionsDto,
} from './dto/index.dto';
import { ClientsService } from './clients.service';
import { CurrentAccount } from 'src/auth/auth.decorator';

@Controller({
  path: 'clients',
  version: '1',
})
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}
  @Get('for-select')
  async forSelect(@CurrentAccount() accountId) {
    const items = await this.clientsService.forSelect(accountId);
    return {
      items: items,
    };
  }
  @Get('list')
  async getList(
    @Query() dataTableOptions: DataTableOptionsDto,
    @CurrentAccount() accountId,
  ) {
    const count = await this.clientsService.count(dataTableOptions, accountId);
    const items = await this.clientsService.getList(
      dataTableOptions,
      accountId,
    );
    return {
      items: items,
      meta: {
        count: count,
      },
    };
  }
  @Get('/:id')
  async getClient(@Param('id') id: string, @CurrentAccount() accountId) {
    const client = await this.clientsService.findById(id);
    if (!client || client.accountId !== accountId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'client not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return client;
  }
  @Post('')
  async addClient(
    @Body() data: AddClientDto,
    @CurrentAccount() accountId,
  ): Promise<Client> {
    return this.clientsService.createClient(data, accountId);
  }
  @Put('/:id')
  async updateClient(
    @Param('id') id: string,
    @Body() data: UpdateClientDto,
    @CurrentAccount() accountId,
  ): Promise<Client> {
    const client = await this.clientsService.findById(id);
    if (!client || client.accountId !== accountId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'client not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return this.clientsService.updateClient(client, data);
  }
  @Delete(':id')
  async deleteClient(
    @Param('id') id: string,
    @CurrentAccount() accountId,
  ): Promise<Client> {
    const client = await this.clientsService.findById(id);
    if (!client || client.accountId !== accountId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'client not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.clientsService.deleteClient({ id: client.id });
  }
}
