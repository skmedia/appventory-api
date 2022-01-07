import { Injectable } from '@nestjs/common';
import { Prisma, Tag } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import AddTagDto from './dto/add-tag.dto';
import DataTableOptionsDto from './dto/data-table-options.dto';
import UpdateTagDto from './dto/update-tag-dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Tag> {
    return this.prisma.tag.findUnique({
      where: {
        id: id,
      },
      include: {
        TagType: {
          include: {
            TagGroup: true,
          },
        },
      },
    });
  }

  async forSelect(tagGroupId: string): Promise<Tag[]> {
    return this.prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
      where: {
        TagType: {
          TagGroup: {
            id: tagGroupId,
          },
        },
      },
      include: {
        TagType: true,
      },
    });
  }

  private buildWhere(
    dataTableOptions: DataTableOptionsDto,
  ): Prisma.TagWhereInput {
    let where: Prisma.TagWhereInput = undefined;
    if (dataTableOptions.term()) {
      where = {
        OR: [
          {
            name: {
              contains: dataTableOptions.term(),
            },
          },
          {
            TagType: {
              name: {
                contains: dataTableOptions.term(),
              },
            },
          },
        ],
      };
    }
    if (dataTableOptions.filter) {
      where = where ?? {};
      if (dataTableOptions.filter?.name) {
        where.name = {
          contains: dataTableOptions.filter.name,
        };
      }
      if (dataTableOptions.filter?.tagType) {
        where.TagType = {
          id: {
            equals: dataTableOptions.filter.tagType,
          },
        };
      }
      if (dataTableOptions.filter?.tagGroup) {
        where.TagType = {
          TagGroup: {
            id: {
              contains: dataTableOptions.filter.tagGroup,
            },
          },
        };
      }
    }
    return where;
  }

  async count(dataTableOptions: DataTableOptionsDto): Promise<number> {
    const where = this.buildWhere(dataTableOptions);
    return this.prisma.tag
      .findMany({
        where: where,
      })
      .then((result) => result.length);
  }

  async getList(dataTableOptions: DataTableOptionsDto): Promise<any[]> {
    const where = this.buildWhere(dataTableOptions);

    return this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
      skip: dataTableOptions.skip(),
      take: dataTableOptions.take(),
      include: {
        TagType: true,
        ApplicationLink: true,
        ApplicationTeamMember: true,
        ApplicationTag: true,
      },
      where: where,
    });
  }

  async createTag(addTagDto: AddTagDto) {
    return this.prisma.tag.create({
      data: {
        id: addTagDto.id,
        name: addTagDto.name,
        tagTypeId: addTagDto.TagType.value,
      },
    });
  }

  async updateTag(id: string, updateTagDto: UpdateTagDto) {
    return this.prisma.tag.update({
      where: {
        id: id,
      },
      data: {
        name: updateTagDto.name,
        tagTypeId: updateTagDto.TagType.value,
      },
    });
  }

  async tagHasBeenUsed(id: string) {
    const promises = [
      this.prisma.applicationTag.findMany({
        where: {
          tagId: id,
        },
      }),
      this.prisma.applicationLink.findMany({
        where: {
          tagId: id,
        },
      }),
      this.prisma.applicationTeamMember.findMany({
        where: {
          tagId: id,
        },
      }),
    ];

    return Promise.all(promises).then((values) => {
      let tagHasBeenUsed = false;
      values.forEach((v) => {
        tagHasBeenUsed = v.length > 0;
      });
      return tagHasBeenUsed;
    });
  }

  async removeTag(id: string) {
    if (await this.tagHasBeenUsed(id)) {
      return;
    }

    return this.prisma.tag.delete({
      where: {
        id: id,
      },
    });
  }
}
