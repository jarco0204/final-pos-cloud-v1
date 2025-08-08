import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Local Imports
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { ShoppingCart, ShoppingCartSchema } from 'src/schemas/ShoppingCart';
import { MongooseLogicalSessionModule } from '../mongoose-logical-session/mongoose-logical-session.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShoppingCart.name, schema: ShoppingCartSchema },
    ]),
    // Import the MongooseLogicalSessionModule to use its service
    MongooseLogicalSessionModule,
  ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
  exports: [ShoppingCartService],
})
export class ShoppingCartModule {}
