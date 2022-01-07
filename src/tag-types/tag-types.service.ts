import { Injectable } from '@nestjs/common';
import { Prisma, TagType } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { TagsService } from 'src/tags/tags.service';
import AddTagTypeDto from './dto/add-tag-type.dto';
import DataTableOptionsDto from './dto/data-table-options.dto';
import UpdateTagTypeDto from './dto/update-tag-type-dto';

@Injectable()
export class TagTypesService {
  constructor(
    private prisma: PrismaService,
    private tagsService: TagsService,
  ) {}

  async findById(id: string): Promise<TagType> {
    return this.prisma.tagType.findUnique({
      where: {
        id: id,
      },
      include: {
        TagGroup: true,
      },
    });
  }

  async forSelect(tagGroupId: string): Promise<TagType[]> {
    return this.prisma.tagType.findMany({
      orderBy: {
        name: 'asc',
      },
      where: {
        TagGroup: {
          id: tagGroupId,
        },
      },
      include: {
        TagGroup: true,
        tags: {
          include: {
            ApplicationLink: true,
            ApplicationTag: true,
            ApplicationTeamMember: true,
          },
        },
      },
    });
  }
  private buildWhere(
    dataTableOptions: DataTableOptionsDto,
  ): Prisma.TagTypeWhereInput {
    let where: Prisma.TagTypeWhereInput = undefined;
    if (dataTableOptions.term()) {
      where = {
        name: {
          contains: dataTableOptions.term(),
        },
      };
    }
    if (dataTableOptions.filter) {
      where = {};
      if (dataTableOptions.filter?.name) {
        where.name = {
          contains: dataTableOptions.filter.name,
        };
      }
      if (dataTableOptions.filter?.tagGroup) {
        where.TagGroup = {
          id: {
            contains: dataTableOptions.filter.tagGroup,
          },
        };
      }
    }
    return where;
  }
  async count(dataTableOptions: DataTableOptionsDto): Promise<number> {
    const where = this.buildWhere(dataTableOptions);
    return this.prisma.tagType
      .findMany({
        where: where,
      })
      .then((result) => result.length);
  }

  async getList(dataTableOptions: DataTableOptionsDto): Promise<TagType[]> {
    const where = this.buildWhere(dataTableOptions);

    return this.prisma.tagType.findMany({
      orderBy: { name: 'asc' },
      skip: dataTableOptions.skip(),
      take: dataTableOptions.take(),
      include: {
        TagGroup: true,
      },
      where: where,
    });
  }

  async createTagType(addTagTypeDto: AddTagTypeDto) {
    return this.prisma.tagType.create({
      data: {
        id: addTagTypeDto.id,
        name: addTagTypeDto.name,
        tagGroupId: addTagTypeDto.tagGroupId,
      },
    });
  }

  async updateTagType(id: string, updateTagTypeDto: UpdateTagTypeDto) {
    return this.prisma.tagType.update({
      where: {
        id: id,
      },
      data: {
        name: updateTagTypeDto.name,
      },
    });
  }

  async removeTagType(id: string) {
    const tags = await this.prisma.tag.findMany({
      where: {
        TagType: {
          id: id,
        },
      },
    });

    let used = false;
    tags.every(async (tag) => {
      if (used) {
        // break loop when used tag has been found
        return false;
      }
      used = await this.tagsService.tagHasBeenUsed(tag.id);
    });

    if (used) {
      return;
    }

    return this.prisma.tagType.delete({
      where: {
        id: id,
      },
    });
  }
}
