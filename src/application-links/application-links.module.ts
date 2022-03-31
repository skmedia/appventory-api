import { Module } from '@nestjs/common';
import { ApplicationLinksService } from './application-links.service';
import { ApplicationLinksController } from './application-links.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { ApplicationsModule } from 'src/applications/applications.module';

@Module({
  imports: [ConfigModule.forRoot(), ApplicationsModule],
  providers: [ApplicationLinksService, PrismaService],
  controllers: [ApplicationLinksController],
})
export class ApplicationLinksModule {}
