import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Product {
  @Prop({ required: true, maxlength: 64 })
  name: string;

  @Prop({ maxlength: 2048 })
  description?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, min: 0 })
  stock: number;

  // Todo: Implement image upload
  //   @Prop({ required: true })
  //   image: string; // Expect a Base64 string (ensure size < 1MB in your validation)
}

// Interface for Product Object Used in Service
export interface ProductObject {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
