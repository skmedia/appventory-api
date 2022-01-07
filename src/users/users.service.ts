import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import AddUserDto from './dto/add-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import DataTableOptionsDto from './dto/data-table-options.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async forSelect(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: {
        firstName: 'asc',
      },
    });
  }
  async findById(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  private buildWhere(
    dataTableOptions: DataTableOptionsDto,
  ): Prisma.UserWhereInput {
    let where: Prisma.UserWhereInput = undefined;
    if (dataTableOptions.term()) {
      where = {
        OR: [
          {
            firstName: {
              contains: dataTableOptions.term(),
            },
          },
          {
            lastName: {
              contains: dataTableOptions.term(),
            },
          },
        ],
      };
    }
    return where;
  }

  async getList(dataTableOptions: DataTableOptionsDto): Promise<any[]> {
    const where = this.buildWhere(dataTableOptions);

    return this.prisma.user.findMany({
      orderBy: { firstName: 'asc' },
      skip: dataTableOptions.skip(),
      take: dataTableOptions.take(),
      where: where,
    });
  }

  async count(dataTableOptions: DataTableOptionsDto): Promise<number> {
    const where = this.buildWhere(dataTableOptions);
    return this.prisma.user
      .findMany({
        where: where,
      })
      .then((result) => result.length);
  }

  async createUser(input: AddUserDto): Promise<User> {
    const data: Prisma.UserCreateInput = {
      id: uuidv4(),
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
    };
    return this.prisma.user.create({
      data: data,
    });
  }

  async updateUser(user: User, input: UpdateUserDto): Promise<User> {
    const data = {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
    };
    const where = {
      id: user.id,
    };

    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
