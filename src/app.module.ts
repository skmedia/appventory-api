import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApplicationsModule } from './applications/applications.module';
import { ConfigModule } from '@nestjs/config';
import { TagsModule } from './tags/tags.module';
import { ClientsModule } from './clients/clients.module';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module';
import { TagGroupsModule } from './tag-groups/tag-groups.module';
import { TagTypesModule } from './tag-types/tag-types.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ApplicationsModule,
    TagsModule,
    ClientsModule,
    UsersModule,
    AssetsModule,
    TagGroupsModule,
    TagTypesModule,
    AuthModule,
    AccountsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
