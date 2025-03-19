import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Local Imports
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product, ProductSchema } from '../../schemas/product.schema';

@Module({
  imports: [
    // MongooseModule: Connect to a MongoDB database
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
