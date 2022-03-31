import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Application, ApplicationLink, Prisma } from '@prisma/client';
import SaveDto from './dto/save.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApplicationNotesService {
  constructor(private prisma: PrismaService) {
    prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
      console.log('Query: ' + event.query);
      console.log('Duration: ' + event.duration + 'ms');
    });
  }

  async save(
    application: Application & {
      notes: Array<ApplicationLink>;
    },
    input: SaveDto,
  ): Promise<Application> {
    const toDelete = application.notes
      .filter((note) => {
        const found = input.notes.find(({ id }) => id === note.id);
        if (found && found?.isNew) {
          return false;
        }
        return !!found === false; // existing note is no longer in input notes, so remove it
      })
      .map((note) => {
        return {
          id: note.id,
        };
      });

    const toAdd = input.notes
      .filter((note) => {
        return note?.isNew;
      })
      .map((note) => {
        return {
          id: note.id,
          tagId: note.tag.id,
          text: note.text,
        };
      });

    const toUpdate = input.notes
      .filter((note) => {
        const found = application.notes.find(({ id }) => id === note.id);
        return !!found === true;
      })
      .map((note) => {
        return {
          where: {
            id: note.id,
          },
          data: {
            tagId: note.tag.id,
            text: note.text,
          },
        };
      });

    const where = {
      id: application.id,
    };

    const updateArgs: Prisma.ApplicationUpdateArgs = {
      data: {
        notes: {
          deleteMany: toDelete,
          updateMany: toUpdate,
          createMany: {
            data: toAdd,
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
      Logger.error('could not update application notes', e);
      throw e;
    }
  }
}
