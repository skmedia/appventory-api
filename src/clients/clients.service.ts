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
  async forSelect(): Promise<Client[]> {
    return this.prisma.client.findMany({
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
  ): Prisma.ClientWhereInput {
    let where: Prisma.ClientWhereInput = undefined;
    if (dataTableOptions.term()) {
      where = {
        OR: [
          {
            name: {
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

  async count(dataTableOptions: DataTableOptionsDto): Promise<number> {
    const where = this.buildWhere(dataTableOptions);
    return this.prisma.client
      .findMany({
        where: where,
      })
      .then((result) => result.length);
  }

  async createClient(input: AddClientDto): Promise<Client> {
    const data: Prisma.ClientCreateInput = {
      id: uuidv4(),
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
