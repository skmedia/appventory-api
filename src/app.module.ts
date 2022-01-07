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
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
