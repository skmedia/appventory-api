import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApplicationsModule } from './applications/applications.module';
import { ApplicationTeamMembersModule } from './application-team-members/application-team-members.module';
import { ApplicationLinksModule } from './application-links/application-links.module';
import { ApplicationNotesModule } from './application-notes/application-notes.module';
import { ApplicationAssetsModule } from './application-assets/application-assets.module';
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
import { UserAccountsModule } from './user-accounts/user-accounts.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT),
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: 'username',
          pass: 'password',
        },
      },
      defaults: {
        from: 'appvento',
      },
      template: {
        dir: process.cwd() + '/templates/mail/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
    ConfigModule.forRoot(),
    ApplicationsModule,
    ApplicationTeamMembersModule,
    ApplicationLinksModule,
    ApplicationNotesModule,
    ApplicationAssetsModule,
    TagsModule,
    ClientsModule,
    UsersModule,
    AssetsModule,
    TagGroupsModule,
    TagTypesModule,
    AuthModule,
    AccountsModule,
    UserAccountsModule,
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
