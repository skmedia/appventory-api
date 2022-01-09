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
import { User } from '@prisma/client';
import { CurrentAccount } from 'src/auth/auth.decorator';
import {
  AddUserDto,
  UpdateUserDto,
  DataTableOptionsDto,
} from './dto/index.dto';
import { UsersService } from './users.service';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('for-select')
  async forSelect(@CurrentAccount() accountId) {
    const items = await this.usersService.forSelect(accountId);
    return {
      items: items,
    };
  }
  @Get('list')
  async getList(
    @Query() dataTableOptions: DataTableOptionsDto,
    @CurrentAccount() accountId,
  ) {
    const count = await this.usersService.count(dataTableOptions, accountId);
    const items = await this.usersService.getList(dataTableOptions, accountId);
    return {
      items: items,
      meta: {
        count: count,
      },
    };
  }
  @Get('/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'user not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }
  @Post('')
  async addUser(
    @Body() data: AddUserDto,
    @CurrentAccount() accountId,
  ): Promise<User> {
    return this.usersService.createUser(data, accountId);
  }
  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
    @CurrentAccount() accountId,
  ): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user || user.accountId !== accountId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'user not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return this.usersService.updateUser(user, data);
  }
  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    @CurrentAccount() accountId,
  ): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user || user.accountId !== accountId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'user not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.usersService.deleteUser({ id: user.id });
  }
}
