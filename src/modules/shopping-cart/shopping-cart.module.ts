import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Local Imports
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { ShoppingCart, ShoppingCartSchema } from 'src/schemas/ShoppingCart';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShoppingCart.name, schema: ShoppingCartSchema },
    ]),
  ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
})
export class ShoppingCartModule {}
