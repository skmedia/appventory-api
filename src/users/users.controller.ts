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
  async forSelect() {
    const items = await this.usersService.forSelect();
    return {
      items: items,
    };
  }
  @Get('list')
  async getList(@Query() dataTableOptions: DataTableOptionsDto) {
    const count = await this.usersService.count(dataTableOptions);
    const items = await this.usersService.getList(dataTableOptions);
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
  async addUser(@Body() data: AddUserDto): Promise<User> {
    return this.usersService.createUser(data);
  }
  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
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

    return this.usersService.updateUser(user, data);
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
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
    return this.usersService.deleteUser({ id: user.id });
  }
}
