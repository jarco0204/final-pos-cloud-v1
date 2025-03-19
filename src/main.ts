import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? PORT);
}

// TODO: Add general app-error handling
bootstrap().catch((err) => console.error(err));
