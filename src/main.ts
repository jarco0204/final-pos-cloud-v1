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
    'Complete API documentation for FinalPOS e-commerce backend. This API provides CRUD operations for products and shopping cart management.',
  )
  .setVersion('1.1.1')
  .addTag('products', 'Product management endpoints')
  .addTag('shopping-cart', 'Shopping cart management endpoints')
  .addBearerAuth()
  .build();

const PORT = process.env.PORT ?? 3000;

// Start point of the application
async function bootstrap() {
  const app = await NestFactory.create(AppModule); // New NestJS HTTP Server
  app.enableCors(); // Enable CORS

  // Swagger API Documentation
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT ?? PORT);
}

// TODO: Add general app-error handling
bootstrap().catch((err) => console.error(err));
