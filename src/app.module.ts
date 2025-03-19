import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './modules/product/product.module';
import { ShoppingCartModule } from './modules/shopping-cart/shopping-cart.module';
import { ShoppingCartService } from './modules/shopping-cart/shopping-cart.service';
import { ShoppingCartController } from './modules/shopping-cart/shopping-cart.controller';

@Module({
  imports: [ProductModule, ShoppingCartModule],
  controllers: [AppController, ShoppingCartController],
  providers: [AppService, ShoppingCartService],
})
export class AppModule {}
