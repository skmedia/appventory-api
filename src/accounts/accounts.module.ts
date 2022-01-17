import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, PrismaService],
})
export class AccountsModule {}
