import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './../prisma.service';
import { Application, ApplicationTag, Prisma } from '@prisma/client';
import AddApplicationDto from './dto/add-application.dto';
import { v4 as uuidv4 } from 'uuid';
import UpdateApplicationDto from './dto/update-application.dto';
import { AssetsService } from 'src/assets/assets.service';
import DataTableOptionsDto from './dto/data-table-options.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private assetsService: AssetsService,
  ) {
    prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
      console.log('Query: ' + event.query);
      console.log('Duration: ' + event.duration + 'ms');
    });
  }

  async findById(id: string): Promise<Application | any | null> {
    return this.prisma.application.findUnique({
      where: {
        id: id,
      },
      include: {
        client: true,
        tags: {
          include: {
            tag: true,
          },
        },
        notes: {
          include: {
            tag: true,
          },
        },
        assets: true,
        links: {
          include: {
            tag: true,
          },
        },
        teamMembers: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  private buildWhere(
    dataTableOptions: DataTableOptionsDto,
    account: string,
  ): Prisma.ApplicationWhereInput {
    let where: Prisma.ApplicationWhereInput = undefined;
    where = {
      accountId: account,
    };
    if (dataTableOptions.activeOnly) {
      where.active = true;
    }
    if (dataTableOptions.hasTags()) {
      const whereTags = [];
      dataTableOptions.tags.forEach((tagId) => {
        whereTags.push({
          tags: { some: { tagId: tagId } },
        });
      });
      if (dataTableOptions.allTags) {
        where.AND = whereTags;
      } else {
        where.OR = whereTags;
      }
    }
    if (dataTableOptions.term()) {
      where.OR = [
        {
          name: {
            contains: dataTableOptions.term(),
          },
        },
        {
          client: {
            name: {
              contains: dataTableOptions.term(),
            },
          },
        },
      ];
    }
    return where;
  }

  buildOrderBy(
    dataTableOptions: DataTableOptionsDto,
  ): Array<Prisma.ApplicationOrderByWithRelationInput> {
    let orderBy: Array<Prisma.ApplicationOrderByWithRelationInput> = [];

    if (dataTableOptions?.sortBy) {
      for (let i = 0; i < dataTableOptions.sortBy.length; i++) {
        if (dataTableOptions.sortBy[i] === 'name') {
          orderBy.push({
            [dataTableOptions.sortBy[i]]: dataTableOptions.sortDesc[i],
          });
        }
        if (dataTableOptions.sortBy[i] === 'client.name') {
          orderBy.push({
            client: {
              name: dataTableOptions.sortDesc[i],
            },
          });
        }
      }
    }
    if (!orderBy.length) {
      orderBy = [
        {
          name: 'asc',
        },
      ];
    }
    return orderBy;
  }

  async getList(
    dataTableOptions: DataTableOptionsDto,
    account: string,
  ): Promise<any[]> {
    const where = this.buildWhere(dataTableOptions, account);
    const orderBy = this.buildOrderBy(dataTableOptions);

    const findManyArgs: Prisma.ApplicationFindManyArgs = {
      orderBy: orderBy,
      where: where,
      include: {
        client: true,
        tags: { select: { label: true } },
      },
    };

    if (dataTableOptions.needsPaging()) {
      findManyArgs.skip = dataTableOptions.skip();
      findManyArgs.take = dataTableOptions.take();
    }

    return this.prisma.application.findMany(findManyArgs);
  }

  async count(
    dataTableOptions: DataTableOptionsDto,
    account: string,
  ): Promise<number> {
    const where = this.buildWhere(dataTableOptions, account);
    return this.prisma.application
      .findMany({
        where: where,
      })
      .then((result) => result.length);
  }

  async addApplication(
    data: AddApplicationDto,
    account: string,
  ): Promise<Application> {
    const application: Prisma.ApplicationCreateInput = {
      id: uuidv4(),
      account: {
        connect: {
          id: account,
        },
      },
      client: {
        connect: {
          id: data.client.id,
        },
      },
      name: data.name,
      description: data.description,
    };
    const app = this.prisma.application.create({
      data: {
        ...application,
      },
    });
    return app;
  }

  async updateApplication(
    application: Application & {
      tags: Array<ApplicationTag>;
    },
    input: UpdateApplicationDto,
  ): Promise<Application> {
    const tagsToDelete = application.tags
      .filter((tag) => {
        const found = input.tags.find(({ id }) => id === tag.tagId);
        return !!found === false; // existing tag is no longer in input tags, so remove it
      })
      .map((t) => {
        return {
          tagId: t.tagId,
        };
      });

    const tagsToAdd = input.tags
      .filter((tag) => {
        const found = application.tags.find(({ tagId }) => tagId === tag.id);
        return !!found === false; // new tag is not in existing tags, add it
      })
      .map((t) => {
        return {
          id: uuidv4(),
          tagId: t.id,
          label: t.label,
        };
      });

    const where = {
      id: application.id,
    };

    const updateArgs: Prisma.ApplicationUpdateArgs = {
      data: {
        name: input.name,
        active: input.active,
        client: {
          connect: {
            id: input.client.id,
          },
        },
        description: input.description,
        tags: {
          deleteMany: tagsToDelete,
          createMany: {
            data: tagsToAdd,
            skipDuplicates: true,
          },
        },
      },
      where: where,
    };

    try {
      const application = await this.prisma.application.update(updateArgs);

      return application;
    } catch (e) {
      Logger.error('could not update application', e);
      throw e;
    }
  }

  async deleteApplication(id: string): Promise<any> {
    return await this.prisma
      .$transaction([
        this.prisma.applicationNote.deleteMany({
          where: { applicationId: id },
        }),
        this.prisma.applicationLink.deleteMany({
          where: { applicationId: id },
        }),
        this.prisma.applicationTag.deleteMany({
          where: { applicationId: id },
        }),
        this.prisma.applicationTeamMember.deleteMany({
          where: { applicationId: id },
        }),
      ])
      .then(async () => {
        const files = await this.prisma.applicationAsset.findMany({
          where: { applicationId: id },
        });

        await this.prisma.applicationAsset.deleteMany({
          where: { applicationId: id },
        });

        await this.prisma.application.delete({
          where: { id },
        });

        this.assetsService.deleteFiles(files);
      });
  }
}
