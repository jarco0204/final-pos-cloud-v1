import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Local Imports
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product, ProductSchema } from '../../schemas/Product';
import { MongooseLogicalSessionModule } from '../mongoose-logical-session/mongoose-logical-session.module';

@Module({
  imports: [
    // MongooseModule: Connect to a MongoDB database
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    // Import the MongooseLogicalSessionModule to use its service
    MongooseLogicalSessionModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
