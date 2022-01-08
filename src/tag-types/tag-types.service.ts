import { Injectable } from '@nestjs/common';
import { Prisma, TagGroup, TagType } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { TagsService } from 'src/tags/tags.service';
import AddTagTypeDto from './dto/add-tag-type.dto';
import DataTableOptionsDto from './dto/data-table-options.dto';
import UpdateTagTypeDto from './dto/update-tag-type-dto';
import slugify from 'slugify';

@Injectable()
export class TagTypesService {
  constructor(
    private prisma: PrismaService,
    private tagsService: TagsService,
  ) {}

  async findById(id: string): Promise<TagType & { tagGroup: TagGroup }> {
    return this.prisma.tagType.findUnique({
      where: {
        id: id,
      },
      include: {
        tagGroup: true,
      },
    });
  }

  async forSelect(tagGroupId: string): Promise<TagType[]> {
    return this.prisma.tagType.findMany({
      orderBy: {
        label: 'asc',
      },
      where: {
        tagGroup: {
          id: tagGroupId,
        },
      },
      include: {
        tagGroup: true,
        tags: {
          include: {
            applicationLinks: true,
            applicationTags: true,
            applicationTeamMembers: true,
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
        label: {
          contains: dataTableOptions.term(),
        },
      };
    }
    if (dataTableOptions.filter) {
      where = {};
      if (dataTableOptions.filter?.label) {
        where.label = {
          contains: dataTableOptions.filter.label,
        };
      }
      if (dataTableOptions.filter?.tagGroup) {
        where.tagGroup = {
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
      orderBy: { label: 'asc' },
      skip: dataTableOptions.skip(),
      take: dataTableOptions.take(),
      include: {
        tagGroup: true,
      },
      where: where,
    });
  }

  async createTagType(addTagTypeDto: AddTagTypeDto) {
    return this.prisma.tagType.create({
      data: {
        id: addTagTypeDto.id,
        label: addTagTypeDto.label,
        code: slugify(addTagTypeDto.label, { lower: true }),
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
        label: updateTagTypeDto.label,
      },
    });
  }

  async removeTagType(id: string) {
    const tags = await this.prisma.tag.findMany({
      where: {
        tagType: {
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

    return await this.prisma.$transaction([
      this.prisma.tag.deleteMany({
        where: { tagTypeId: id },
      }),
      this.prisma.tagType.delete({
        where: {
          id: id,
        },
      }),
    ]);
  }
}
