import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { AssetsModule } from 'src/assets/assets.module';

@Module({
  imports: [ConfigModule.forRoot(), AssetsModule],
  providers: [ApplicationsService, PrismaService],
  controllers: [ApplicationsController],
})
export class ApplicationsModule {}
