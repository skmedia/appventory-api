import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AssetsController } from './assets.controller';
import { AssetsRepository } from './assets.repository';
import { AssetsService } from './assets.service';

@Module({
  controllers: [AssetsController],
  providers: [AssetsService, AssetsRepository, PrismaService],
  exports: [AssetsRepository, AssetsService],
})
export class AssetsModule {}
