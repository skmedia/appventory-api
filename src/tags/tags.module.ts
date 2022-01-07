import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  controllers: [TagsController],
  providers: [TagsService, PrismaService],
  exports: [TagsService],
})
export class TagsModule {}
