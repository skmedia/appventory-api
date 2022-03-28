import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Application, ApplicationTeamMember, Prisma } from '@prisma/client';
import SaveDto from './dto/save.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApplicationTeamMembersService {
  constructor(private prisma: PrismaService) {
    prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
      console.log('Query: ' + event.query);
      console.log('Duration: ' + event.duration + 'ms');
    });
  }

  async save(
    application: Application & {
      teamMembers: Array<ApplicationTeamMember>;
    },
    input: SaveDto,
  ): Promise<Application> {
    const toDelete = application.teamMembers
      .filter((teamMember) => {
        const found = input.teamMembers.find(
          (inputTeamMember) =>
            inputTeamMember.userId === teamMember.userId &&
            inputTeamMember.tagId === teamMember.tagId,
        );
        return !!found === false;
      })
      .map((t) => {
        return {
          tagId: t.tagId,
        };
      });

    const toAdd = input.teamMembers
      .filter((teamMember) => {
        const found = application.teamMembers.find(
          (appTeamMember) =>
            appTeamMember.tagId === teamMember.tagId &&
            appTeamMember.userId === teamMember.userId,
        );
        return !!found === false;
      })
      .map((tm) => {
        return {
          id: uuidv4(),
          userId: tm.userId,
          tagId: tm.tag.id,
          userFullName: tm.userFullName,
        };
      });

    const where = {
      id: application.id,
    };

    const data = {
      teamMembers: {
        deleteMany: toDelete,
        createMany: {
          data: toAdd,
          skipDuplicates: true,
        },
      },
    };

    try {
      const application = await this.prisma.application.update({
        data,
        where,
      });

      return application;
    } catch (e) {
      Logger.error('could not update application', e);
      throw e;
    }
  }
}
