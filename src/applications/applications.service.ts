import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './../prisma.service';
import {
  Application,
  ApplicationAsset,
  ApplicationLink,
  ApplicationTag,
  ApplicationTeamMember,
  Prisma,
} from '@prisma/client';
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
  ) {}

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
        notes: true,
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

    const sortDir = (value: string) => (value === 'true' ? 'desc' : 'asc');

    if (dataTableOptions?.sortBy) {
      for (let i = 0; i < dataTableOptions.sortBy.length; i++) {
        if (dataTableOptions.sortBy[i] === 'name') {
          orderBy.push({
            [dataTableOptions.sortBy[i]]: sortDir(dataTableOptions.sortDesc[i]),
          });
        }
        if (dataTableOptions.sortBy[i] === 'client.name') {
          orderBy.push({
            client: {
              name: sortDir(dataTableOptions.sortDesc[i]),
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

    return this.prisma.application.findMany({
      orderBy: orderBy,
      skip: dataTableOptions.skip(),
      take: dataTableOptions.take(),
      where: where,
      include: {
        client: true,
      },
    });
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

  async createApplication(
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
    const newTags = data.tags.map((t) => {
      return {
        id: uuidv4(),
        tagId: t.id,
        label: t.label,
      };
    });
    const newLinks = data.links.map((t) => {
      return {
        id: uuidv4(),
        type: t.tag.id,
        tagId: t.tag.id,
        url: t.url,
      };
    });
    const newTeamMembers = data.teamMembers.map((t) => {
      return {
        id: uuidv4(),
        userId: t.userId,
        tagId: t.tag.id,
        userFullName: t.userFullName,
      };
    });
    const newAssets = data.filesToAdd.map((a) => {
      return {
        id: uuidv4(),
        type: a.type,
        filename: a.filename,
        description: a.description,
      };
    });
    return this.prisma.application.create({
      data: {
        ...application,
        assets: {
          createMany: {
            data: newAssets,
          },
        },
        tags: {
          createMany: {
            data: newTags,
          },
        },
        links: {
          createMany: {
            data: newLinks,
          },
        },
        teamMembers: {
          createMany: {
            data: newTeamMembers,
          },
        },
      },
    });
  }

  async updateApplication(
    application: Application & {
      tags: Array<ApplicationTag>;
      links: Array<ApplicationLink>;
      teamMembers: Array<ApplicationTeamMember>;
      assets: Array<ApplicationAsset>;
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

    const deleteExistingLinks = application.links.map((t) => {
      return {
        tagId: t.tagId,
      };
    });
    const newLinks = input.links.map((t) => {
      return {
        id: uuidv4(),
        type: t.tag.id,
        tagId: t.tag.id,
        url: t.url,
      };
    });

    const deleteExistingTeamMembers = application.teamMembers.map((t) => {
      return {
        tagId: t.tagId,
      };
    });
    const newTeamMembers = input.teamMembers.map((t) => {
      return {
        id: uuidv4(),
        userId: t.userId,
        tagId: t.tag.id,
        userFullName: t.userFullName,
      };
    });

    const filesToDelete = application.assets.filter((asset) => {
      const found = input.assets.find(({ id }) => id === asset.id);
      return !!found === false; // existing asset is no longer in input assets, so remove it
    });

    const newAssets = input.filesToAdd.map((a) => {
      return {
        id: uuidv4(),
        type: a.type,
        filename: a.filename,
        description: a.description,
      };
    });

    const where = {
      id: application.id,
    };

    const data = {
      name: input.name,
      client: {
        connect: {
          id: input.client.id,
        },
      },
      description: input.description,
      assets: {
        deleteMany: filesToDelete.map((file) => {
          return { id: file.id };
        }),
        updateMany: input.assets.map((file) => {
          return {
            where: {
              id: file.id,
            },
            data: {
              description: file.description,
            },
          };
        }),
        createMany: {
          data: newAssets,
          skipDuplicates: true,
        },
      },
      teamMembers: {
        deleteMany: deleteExistingTeamMembers,
        createMany: {
          data: newTeamMembers,
          skipDuplicates: true,
        },
      },
      tags: {
        deleteMany: tagsToDelete,
        createMany: {
          data: tagsToAdd,
          skipDuplicates: true,
        },
      },
      links: {
        deleteMany: deleteExistingLinks,
        createMany: {
          data: newLinks,
          skipDuplicates: true,
        },
      },
    };

    try {
      const application = await this.prisma.application.update({
        data,
        where,
      });

      if (filesToDelete.length) {
        await this.assetsService.deleteFilesInFolder(
          application.id,
          filesToDelete.map((file) => file.filename),
        );
      }
      await this.assetsService.moveFiles(
        application.id,
        input.filesToAdd.map((f) => f.path),
      );

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
        await this.assetsService.deleteFilesInFolder(
          id,
          files.map((f) => f.filename),
        );
        await this.prisma.application.delete({
          where: { id },
        });
      });
  }
}
