import { Injectable } from '@nestjs/common';
import { TagGroup } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TagGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<TagGroup> {
    return this.prisma.tagGroup.findUnique({
      where: {
        id: id,
      },
    });
  }

  public getList(account: string) {
    return this.prisma.tagGroup.findMany({
      where: {
        accountId: account,
      },
      orderBy: {
        label: 'asc',
      },
    });
  }
}
