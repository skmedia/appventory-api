import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import AddUserDto from './dto/add-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import DataTableOptionsDto from './dto/data-table-options.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async forSelect(accountId: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        accountId: accountId,
      },
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

  async findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  private buildWhere(
    dataTableOptions: DataTableOptionsDto,
    accountId: string,
  ): Prisma.UserWhereInput {
    let where: Prisma.UserWhereInput = undefined;
    where = {
      accountId: accountId,
    };
    if (dataTableOptions.term()) {
      where.OR = [
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
      ];
    }
    return where;
  }

  async getList(
    dataTableOptions: DataTableOptionsDto,
    accountId: string,
  ): Promise<any[]> {
    const where = this.buildWhere(dataTableOptions, accountId);

    return this.prisma.user.findMany({
      orderBy: { firstName: 'asc' },
      skip: dataTableOptions.skip(),
      take: dataTableOptions.take(),
      where: where,
    });
  }

  async count(
    dataTableOptions: DataTableOptionsDto,
    accountId: string,
  ): Promise<number> {
    const where = this.buildWhere(dataTableOptions, accountId);
    return this.prisma.user
      .findMany({
        where: where,
      })
      .then((result) => result.length);
  }

  async createUser(input: AddUserDto, accountId: string): Promise<User> {
    const password = await hash(uuidv4(), 10);

    const data: Prisma.UserCreateInput = {
      id: uuidv4(),
      account: {
        connect: {
          id: accountId,
        },
      },
      role: input.role,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: password,
    };
    return this.prisma.user.create({
      data: data,
    });
  }

  async updateUser(user: User, input: UpdateUserDto): Promise<User> {
    const data = {
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
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
