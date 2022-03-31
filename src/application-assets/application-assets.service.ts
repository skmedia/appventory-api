import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Application, ApplicationAsset, Prisma } from '@prisma/client';
import SaveDto from './dto/save.dto';
import { v4 as uuidv4 } from 'uuid';
import { AssetsService } from 'src/assets/assets.service';

@Injectable()
export class ApplicationAssetsService {
  constructor(
    private prisma: PrismaService,
    private assetsService: AssetsService,
  ) {
    prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
      console.log('Query: ' + event.query);
      console.log('Duration: ' + event.duration + 'ms');
    });
  }

  async save(
    application: Application & {
      assets: Array<ApplicationAsset>;
    },
    input: SaveDto,
  ): Promise<Application> {
    const filesToDelete = application.assets.filter((asset) => {
      const found = input.assets.find(({ id }) => id === asset.id);
      return !!found === false; // existing asset is no longer in input assets, so remove it
    });

    const newAssets = input.filesToAdd.map((a) => {
      return {
        id: uuidv4(),
        type: a.type,
        key: a.key,
        location: a.location,
        filename: a.filename,
        description: a.description,
      };
    });

    const where = {
      id: application.id,
    };

    const updateArgs: Prisma.ApplicationUpdateArgs = {
      data: {
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
      },
      where: where,
    };

    try {
      const application = await this.prisma.application.update(updateArgs);

      if (filesToDelete.length) {
        this.assetsService.deleteFiles(filesToDelete);
      }

      return application;
    } catch (e) {
      Logger.error('could not update application assets', e);
      this.assetsService.deleteFiles(input.filesToAdd);
      throw e;
    }
  }
}
