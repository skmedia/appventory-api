import { Logger, Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { PrismaService } from 'src/prisma.service';
import { AssetsController } from './assets.controller';
import { AssetsRepository } from './assets.repository';
import { AssetsService } from './assets.service';
import { AwsFileService } from './aws-file.service';

const s3ClientFactory = {
  provide: 'S3_CLIENT',
  useFactory: () => {
    Logger.log('new S3!');
    return new S3({
      region: process.env.BUCKETEER_AWS_REGION,
      credentials: {
        accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
      },
    });
  },
};

@Module({
  controllers: [AssetsController],
  providers: [
    AwsFileService,
    AssetsService,
    AssetsRepository,
    PrismaService,
    s3ClientFactory,
  ],
  exports: [AssetsRepository, AssetsService, AwsFileService],
})
export class AssetsModule {}
