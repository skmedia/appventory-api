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

  public getList() {
    return this.prisma.tagGroup.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}
