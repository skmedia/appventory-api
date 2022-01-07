import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { PrismaService } from './prisma.service';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./keys/server.key'),
    cert: fs.readFileSync('./keys/server.crt'),
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: { target: true, value: true },
      stopAtFirstError: true,
      validateCustomDecorators: true,
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  await app.listen(3000);
}
bootstrap();
