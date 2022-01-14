import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { PrismaService } from './prisma.service';

async function bootstrap() {
  let httpsOptions = null;
  if (process.env.PORT === '3000') {
    httpsOptions = {
      key: fs.readFileSync('./keys/localhost-key.pem'),
      cert: fs.readFileSync('./keys/localhost.pem'),
    };
  }
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

  await app.listen(process.env.PORT);
}
bootstrap();
