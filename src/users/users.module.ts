import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { UserIsUnique } from './unique-user.validator';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UserIsUnique],
  exports: [UsersService, UserIsUnique],
})
export class UsersModule {}
