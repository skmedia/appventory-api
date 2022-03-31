import { Module } from '@nestjs/common';
import { ApplicationNotesService } from './application-notes.service';
import { ApplicationNotesController } from './application-notes.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { ApplicationsModule } from 'src/applications/applications.module';

@Module({
  imports: [ConfigModule.forRoot(), ApplicationsModule],
  providers: [ApplicationNotesService, PrismaService],
  controllers: [ApplicationNotesController],
})
export class ApplicationNotesModule {}
