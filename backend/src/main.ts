import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://*.quizzy-68c.pages.dev',
      'https://quizzy-68c.pages.dev',
    ],
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
