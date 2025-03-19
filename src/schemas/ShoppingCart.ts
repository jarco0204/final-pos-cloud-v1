import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ShoppingCart {
  @Prop({
    type: [
      {
        product: {
          type: MongooseSchema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    default: [],
  })
  items: { product: Types.ObjectId; quantity: number }[];
}

export type ShoppingCartDocument = ShoppingCart & Document;
export const ShoppingCartSchema = SchemaFactory.createForClass(ShoppingCart);
