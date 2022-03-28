import { Module } from '@nestjs/common';
import { ApplicationTeamMembersService } from './application-team-members.service';
import { ApplicationTeamMembersController } from './application-team-members.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { ApplicationsModule } from 'src/applications/applications.module';

@Module({
  imports: [ConfigModule.forRoot(), ApplicationsModule],
  providers: [ApplicationTeamMembersService, PrismaService],
  controllers: [ApplicationTeamMembersController],
})
export class ApplicationTeamMembersModule {}
