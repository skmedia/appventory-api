import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TagGroupsController } from './tag-groups.controller';
import { TagGroupsService } from './tag-groups.service';

@Module({
  controllers: [TagGroupsController],
  providers: [TagGroupsService, PrismaService],
})
export class TagGroupsModule {}
