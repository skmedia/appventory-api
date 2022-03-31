import { Module } from '@nestjs/common';
import { ApplicationAssetsService } from './application-assets.service';
import { ApplicationAssetsController } from './application-assets.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { ApplicationsModule } from 'src/applications/applications.module';
import { AssetsModule } from 'src/assets/assets.module';

@Module({
  imports: [ConfigModule.forRoot(), ApplicationsModule, AssetsModule],
  providers: [ApplicationAssetsService, PrismaService],
  controllers: [ApplicationAssetsController],
})
export class ApplicationAssetsModule {}
