import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Load environment variables from .env file
dotenv.config();

// Configuration
const config = new DocumentBuilder()
  .setTitle('FinalPOS: Shop and Cart API')
  .setDescription(
    'API documentation for backend coding task to create CRUD App for Shop and Cart',
  )
  .setVersion('1.1.1')
  .build();

const PORT = process.env.PORT ?? 3000;

// Start point of the application
async function bootstrap() {
  const app = await NestFactory.create(AppModule); // New NestJS HTTP Server
  app.enableCors(); // Enable CORS

  // Swagger API Documentation
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT ?? PORT);
}

// TODO: Add general app-error handling
bootstrap().catch((err) => console.error(err));
