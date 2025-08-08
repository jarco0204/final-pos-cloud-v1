import { join } from 'path';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Local Imports
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ProductModule } from './modules/product/product.module';
import { ShoppingCartModule } from './modules/shopping-cart/shopping-cart.module';

@Module({
  imports: [
    ProductModule,
    ShoppingCartModule,
    // Event-Emitter Module: Event-Driven Architecture
    EventEmitterModule.forRoot(),

    // ServeStaticModule: Serve static files from the 'public' directory
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    // MongooseModule: Connect to a MongoDB database
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://mongo:27017/nestjs-db',
    ),
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
