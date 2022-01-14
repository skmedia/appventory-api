import { Injectable } from '@nestjs/common';
import { ApplicationAsset } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AssetsRepository {
  constructor(private prisma: PrismaService) {}

  async findOneById(id: string): Promise<any> {
    return this.prisma.applicationAsset.findUnique({
      where: {
        id,
      },
      include: {
        application: true,
      },
    });
  }

  async findByApplicationId(applicationId: string) {
    return this.prisma.applicationAsset.findMany({
      where: {
        applicationId,
      },
    });
  }

  async findManyByFileId(fileIds: Array<string>) {
    return this.prisma.applicationAsset.findMany({
      where: {
        id: {
          in: fileIds,
        },
      },
    });
  }
}
