import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, NotFoundException } from '@nestjs/common';

// Local Imports
import { Product, ProductDocument } from 'src/schemas/Product';
import { CreateProductDto } from './validators/create-product-dto';
import { UpdateProductDto } from './validators/update-product-dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  // Listener for when products are added to the cart
  @OnEvent('cart.product.updated', { async: true })
  async handleCartProductUpdated(payload: {
    productId: string;
    quantityDifference: number;
    logicalSessionID: string;
  }): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // Update product stock within the Mongoose session.
      const updated = await this.productModel
        .findByIdAndUpdate(
          payload.productId,
          { $inc: { stock: -payload.quantityDifference } },
          { session },
        )
        .exec();

      if (!updated) {
        throw new NotFoundException(
          `Product with id ${payload.productId} not found`,
        );
      }

      // If update succeeds, mark the logical session as 'committed'
      // await this.logicalSessionService.updateLogicalSessionStatus(
      //   payload.logicalSessionID,
      //   'committed',
      // );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.error(
        `Failed to update stock for product ${payload.productId}:`,
        error,
      );
      // Optionally mark the logical session as 'rolled_back'
      // await this.logicalSessionService.updateLogicalSessionStatus(
      //   payload.logicalSessionID,
      //   'rolled_back',
      // );
      throw error; // Propagate the error to be handled by emitAsync caller if needed
    } finally {
      void session.endSession();
    }
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
