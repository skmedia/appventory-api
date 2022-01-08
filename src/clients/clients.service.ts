import { Injectable } from '@nestjs/common';
import { Prisma, Client } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import {
  AddClientDto,
  UpdateClientDto,
  DataTableOptionsDto,
} from './dto/index.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}
  async forSelect(accountId: string): Promise<Client[]> {
    return this.prisma.client.findMany({
      where: {
        accountId: accountId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
  async findById(id: string): Promise<Client> {
    return this.prisma.client.findUnique({
      where: {
        id: id,
      },
    });
  }

  private buildWhere(
    dataTableOptions: DataTableOptionsDto,
    account: string,
  ): Prisma.ClientWhereInput {
    let where: Prisma.ClientWhereInput = undefined;
    where = {
      accountId: account,
    };
    if (dataTableOptions.term()) {
      where.OR = [
        {
          name: {
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

    return this.prisma.client.findMany({
      orderBy: { name: 'asc' },
      skip: dataTableOptions.skip(),
      take: dataTableOptions.take(),
      where: where,
      include: {
        applications: true,
      },
    });
  }

  async count(
    dataTableOptions: DataTableOptionsDto,
    accountId: string,
  ): Promise<number> {
    const where = this.buildWhere(dataTableOptions, accountId);
    return this.prisma.client
      .findMany({
        where: where,
      })
      .then((result) => result.length);
  }

  async createClient(input: AddClientDto, accountId: string): Promise<Client> {
    const data: Prisma.ClientCreateInput = {
      id: uuidv4(),
      account: {
        connect: {
          id: accountId,
        },
      },
      name: input.name,
    };
    return this.prisma.client.create({
      data: data,
    });
  }

  async updateClient(client: Client, input: UpdateClientDto): Promise<Client> {
    const data = {
      name: input.name,
    };
    const where = {
      id: client.id,
    };

    return this.prisma.client.update({
      data,
      where,
    });
  }

  async deleteClient(where: Prisma.ClientWhereUniqueInput): Promise<Client> {
    return this.prisma.client.delete({
      where,
    });
  }
}
