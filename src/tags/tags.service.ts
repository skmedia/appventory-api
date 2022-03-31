import { Injectable } from '@nestjs/common';
import { Prisma, Tag, TagGroup, TagType } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import AddTagDto from './dto/add-tag.dto';
import DataTableOptionsDto from './dto/data-table-options.dto';
import UpdateTagDto from './dto/update-tag-dto';
import slugify from 'slugify';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async findById(
    id: string,
  ): Promise<Tag & { tagType: TagType & { tagGroup: TagGroup } }> {
    return this.prisma.tag.findUnique({
      where: {
        id: id,
      },
      include: {
        tagType: {
          include: {
            tagGroup: true,
          },
        },
      },
    });
  }

  async forSelect(accountId: string, tagGroupCode?: string): Promise<Tag[]> {
    const tagGroup: any = {
      accountId: accountId,
    };
    if (tagGroupCode) {
      tagGroup.code = tagGroupCode;
    }
    return this.prisma.tag.findMany({
      orderBy: {
        label: 'asc',
      },
      where: {
        tagType: {
          tagGroup: tagGroup,
        },
      },
      include: {
        tagType: true,
      },
    });
  }

  private buildWhere(
    dataTableOptions: DataTableOptionsDto,
    accountId: string,
  ): Prisma.TagWhereInput {
    let where: Prisma.TagWhereInput = undefined;
    where = {
      tagType: {
        tagGroup: {
          accountId: accountId,
        },
      },
    };
    if (dataTableOptions.term()) {
      where.OR = [
        {
          label: {
            contains: dataTableOptions.term(),
          },
        },
        {
          tagType: {
            label: {
              contains: dataTableOptions.term(),
            },
          },
        },
      ];
    }
    if (dataTableOptions.filter) {
      where = where ?? {};
      if (dataTableOptions.filter?.name) {
        where.label = {
          contains: dataTableOptions.filter.name,
        };
      }
      if (dataTableOptions.filter?.tagType) {
        where.tagType = {
          id: {
            equals: dataTableOptions.filter.tagType,
          },
        };
      }
      if (dataTableOptions.filter?.tagGroup) {
        where.tagType = {
          tagGroup: {
            id: {
              contains: dataTableOptions.filter.tagGroup,
            },
          },
        };
      }
    }
    return where;
  }

  async count(
    dataTableOptions: DataTableOptionsDto,
    accountId: string,
  ): Promise<number> {
    const where = this.buildWhere(dataTableOptions, accountId);
    return this.prisma.tag
      .findMany({
        where: where,
      })
      .then((result) => result.length);
  }

  async getList(
    dataTableOptions: DataTableOptionsDto,
    accountId: string,
  ): Promise<any[]> {
    const where = this.buildWhere(dataTableOptions, accountId);

    const findManyArgs: Prisma.TagFindManyArgs = {
      orderBy: { label: 'asc' },
      include: {
        tagType: true,
        applicationLinks: true,
        applicationTeamMembers: true,
        applicationTags: true,
      },
      where: where,
    };

    if (dataTableOptions.needsPaging()) {
      findManyArgs.skip = dataTableOptions.skip();
      findManyArgs.take = dataTableOptions.take();
    }

    return this.prisma.tag.findMany(findManyArgs);
  }

  async createTag(addTagDto: AddTagDto) {
    return this.prisma.tag.create({
      data: {
        id: addTagDto.id,
        code: slugify(addTagDto.label, { lower: true }),
        label: addTagDto.label,
        tagTypeId: addTagDto.tagType.value,
      },
    });
  }

  async updateTag(id: string, updateTagDto: UpdateTagDto) {
    return this.prisma.tag.update({
      where: {
        id: id,
      },
      data: {
        label: updateTagDto.label,
        tagTypeId: updateTagDto.tagType.value,
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
      this.prisma.applicationNote.findMany({
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
