import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserAccountsController } from './user-accounts.controller';
import { UserAccountsService } from './user-accounts.service';

@Module({
  controllers: [UserAccountsController],
  providers: [UserAccountsService, PrismaService],
  exports: [UserAccountsService],
})
export class UserAccountsModule {}
