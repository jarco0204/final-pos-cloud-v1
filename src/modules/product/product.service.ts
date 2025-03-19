import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, NotFoundException } from '@nestjs/common';

// Local Imports
import { Product, ProductDocument } from 'src/schemas/Product';
import { CreateProductDto } from './validators/create-product-dto';
import { UpdateProductDto } from './validators/update-product-dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  // Listener for when products are added to the cart
  @OnEvent('cart.product.added')
  async handleProductAdded(payload: { productId: string; quantity: number }) {
    // Decrement the product stock by the quantity added to the cart
    await this.productModel.findByIdAndUpdate(payload.productId, {
      $inc: { stock: -payload.quantity },
    });
  }

  // Listener for when products are removed from the cart
  @OnEvent('cart.product.removed')
  async handleProductRemoved(payload: { productId: string; quantity: number }) {
    // Increment the product stock by the quantity removed from the cart
    await this.productModel.findByIdAndUpdate(payload.productId, {
      $inc: { stock: payload.quantity },
    });
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return updatedProduct;
  }

  async delete(id: string): Promise<Product> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return deletedProduct;
  }
}
