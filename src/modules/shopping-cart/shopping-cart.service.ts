import { Connection, Model, Types } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, NotFoundException } from '@nestjs/common';

// Local Imports
import { CartItemDto } from './validators/create-shopping-cart-item.dto';
import { ShoppingCart, ShoppingCartDocument } from '../../schemas/ShoppingCart';
import { MongooseLogicalSessionService } from '../mongoose-logical-session/mongoose-logical-session.service';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectModel(ShoppingCart.name)
    private cartModel: Model<ShoppingCartDocument>,
    private eventEmitter: EventEmitter2,
    @InjectConnection()
    private readonly connection: Connection,
    private logicalSessionService: MongooseLogicalSessionService,
  ) {}

  // Create a new shopping cart
  async createCart(): Promise<ShoppingCartDocument> {
    const newCart = new this.cartModel({ items: [] });
    return newCart.save();
  }

  // Get a cart by ID
  async getCart(cartId: string): Promise<ShoppingCartDocument> {
    const cart = await this.cartModel
      .findById(cartId)
      .populate('items.product')
      .exec();
    if (!cart) {
      throw new NotFoundException(`Cart with id ${cartId} not found`);
    }
    return cart;
  }

  // Add or update a product in the cart
  async addProduct(
    cartId: string,
    cartItemDto: CartItemDto,
  ): Promise<ShoppingCartDocument> {
    // Start a Mongoose session and begin a transaction
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // Retrieve the cart within the session context
      const cart = await this.getCart(cartId); // TODO_J: Add logicalSessionID
      const productObjectId = new Types.ObjectId(cartItemDto.product);
      const existingIndex = cart.items.findIndex(
        (item) => item.product.toString() === productObjectId.toString(),
      );

      let quantityDifference = cartItemDto.quantity; // assume full quantity if adding new

      if (existingIndex !== -1) {
        // If product already exists, calculate the additional quantity to add.
        quantityDifference = cartItemDto.quantity;
        cart.items[existingIndex].quantity += cartItemDto.quantity;
      } else {
        // If new product, push it and the quantityDifference remains as provided.
        cart.items.push({
          product: productObjectId,
          quantity: cartItemDto.quantity,
        });
      }

      // Create a logical session record for this group of operations.
      const logicalSession =
        await this.logicalSessionService.createLogicalSession(60);

      // Emit the unified stock update event including the logical session ID
      await this.updateProductStockHelper(
        productObjectId.toString(),
        quantityDifference,
        logicalSession?._id?.toString() || '111',
      );

      // Save the cart within the session
      const savedCart = await cart.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      return savedCart;
    } catch (error) {
      // Rollback the transaction in case of error
      await session.abortTransaction();
      throw error;
    } finally {
      void session.endSession();
    }
  }

  // Update the quantity of a product in the cart
  async updateProductQuantity(
    cartId: string,
    cartItemDto: CartItemDto,
  ): Promise<ShoppingCartDocument> {
    const cart = await this.getCart(cartId);
    const productObjectId = new Types.ObjectId(cartItemDto.product);
    const index = cart.items.findIndex(
      (item) => item.product._id.toString() === productObjectId.toString(),
    );
    if (index === -1) {
      throw new NotFoundException(
        `Product with id ${cartItemDto.product} not found in the cart`,
      );
    }

    const currentQuantity = cart.items[index].quantity;
    const newQuantity = cartItemDto.quantity;
    const quantityDifference = newQuantity - currentQuantity;

    // Update the cart's quantity
    cart.items[index].quantity = newQuantity;
    const savedCart = await cart.save();

    // Emit a unified event with the quantity difference.
    await this.updateProductStockHelper(
      productObjectId.toString(),
      quantityDifference,
    );

    return savedCart;
  }

  // Helper Method to Reduce Code Duplication & Emit Add Event
  async updateProductStockHelper(
    productId: string,
    quantityDifference: number,
    logicalSessionID: string = '111',
  ): Promise<void> {
    try {
      await this.eventEmitter.emitAsync('cart.product.updated', {
        productId,
        quantityDifference,
        logicalSessionID,
      });
    } catch (error) {
      console.error('Error emitting stock update event:', error);
      throw error;
    }
  }

  // Delete a product from the cart
  async deleteProduct(
    cartId: string,
    productId: string,
  ): Promise<ShoppingCartDocument> {
    const cart = await this.getCart(cartId);
    const productObjectId = new Types.ObjectId(productId);
    const item = cart.items.find(
      (item) => item.product._id.toString() === productObjectId.toString(),
    );
    if (!item) {
      throw new NotFoundException(
        `Product with id ${productId} not found in the cart`,
      );
    }

    // Emit the unified event with negative quantity (indicating removal)
    await this.updateProductStockHelper(
      productObjectId.toString(),
      -item.quantity,
    );

    // Remove the product from the cart
    cart.items.splice(cart.items.indexOf(item), 1);
    return cart.save();
  }

  // Delete the entire cart
  async deleteCart(cartId: string): Promise<ShoppingCartDocument> {
    const cart = await this.cartModel.findByIdAndDelete(cartId).exec();
    if (!cart) {
      throw new NotFoundException(`Cart with id ${cartId} not found`);
    }

    for (const item of cart.items) {
      // Emit a negative quantity for each removed item
      await this.updateProductStockHelper(
        item.product.toString(),
        -item.quantity,
      );
    }
    return cart;
  }
}
