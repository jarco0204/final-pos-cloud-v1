import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Local imports
import { BaseEntity } from './BaseEntity';

@Schema({ collection: 'products' })
export class Product extends BaseEntity {
  @Prop({ required: true, maxlength: 64 })
  name: string;

  @Prop({ maxlength: 2048 })
  description?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, min: 0 })
  stock: number;

  @Prop({ required: true, maxlength: 1048576 }) // 1MB in bytes
  image: string; // Expect a Base64 string
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
