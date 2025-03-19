import { join } from 'path';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductModule } from './modules/product/product.module';
import { ShoppingCartModule } from './modules/shopping-cart/shopping-cart.module';
import { ShoppingCartService } from './modules/shopping-cart/shopping-cart.service';
import { ShoppingCartController } from './modules/shopping-cart/shopping-cart.controller';

@Module({
  imports: [
    ProductModule,
    ShoppingCartModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController, ShoppingCartController],
  providers: [AppService, ShoppingCartService],
})
export class AppModule {}
