import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TagsModule } from 'src/tags/tags.module';
import { TagTypesController } from './tag-types.controller';
import { TagTypesService } from './tag-types.service';

@Module({
  controllers: [TagTypesController],
  imports: [TagsModule],
  providers: [TagTypesService, PrismaService],
})
export class TagTypesModule {}
