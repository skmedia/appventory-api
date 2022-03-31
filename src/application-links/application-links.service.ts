import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Application, ApplicationLink, Prisma } from '@prisma/client';
import SaveDto from './dto/save.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApplicationLinksService {
  constructor(private prisma: PrismaService) {
    prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
      console.log('Query: ' + event.query);
      console.log('Duration: ' + event.duration + 'ms');
    });
  }

  async save(
    application: Application & {
      links: Array<ApplicationLink>;
    },
    input: SaveDto,
  ): Promise<Application> {
    const toDelete = application.links
      .filter((link) => {
        const found = input.links.find(
          (inputLink) => inputLink.tagId === link.tagId,
        );
        return !!found === false;
      })
      .map((t) => {
        return {
          tagId: t.tagId,
        };
      });

    const toAdd = input.links
      .filter((link) => {
        const found = application.links.find(
          (appLink) => appLink.tagId === link.tagId,
        );
        return !!found === false;
      })
      .map((t) => {
        return {
          id: uuidv4(),
          type: t.tag.id,
          tagId: t.tag.id,
          url: t.url,
        };
      });

    const where = {
      id: application.id,
    };

    const data = {
      links: {
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
      Logger.error('could not update application links', e);
      throw e;
    }
  }
}
