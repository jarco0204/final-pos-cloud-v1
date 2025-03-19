import { Schema as MongooseSchema } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

// Local Imports
import { Product } from './Product';

@Schema()
export class CartItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  product: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;
}
export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class ShoppingCart {
  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];
}

export type ShoppingCartDocument = ShoppingCart & Document;
export const ShoppingCartSchema = SchemaFactory.createForClass(ShoppingCart);

export interface ShoppingCartObject {
  id: string;
  products: Product[];
}
