import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, NotFoundException } from '@nestjs/common';

// Local Imports
import { CartItemDto } from './validators/create-shopping-cart-item.dto';
import { ShoppingCart, ShoppingCartDocument } from '../../schemas/ShoppingCart';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectModel(ShoppingCart.name)
    private cartModel: Model<ShoppingCartDocument>,
    private eventEmitter: EventEmitter2,
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
  async addOrUpdateProduct(
    cartId: string,
    cartItemDto: CartItemDto,
  ): Promise<ShoppingCartDocument> {
    const cart = await this.getCart(cartId);
    const productObjectId = new Types.ObjectId(cartItemDto.product);
    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productObjectId.toString(),
    );
    if (existingIndex !== -1) {
      this.updateProductQuantityHelper(
        productObjectId.toString(),
        cartItemDto.quantity,
      );

      // Increase the quantity
      cart.items[existingIndex].quantity += cartItemDto.quantity;
    } else {
      this.updateProductQuantityHelper(productObjectId.toString(), 1);
      // Add new product to cart
      cart.items.push({
        product: productObjectId,
        quantity: cartItemDto.quantity,
      });
    }
    return cart.save();
  }

  // Helper Method to Reduce Code Duplication & Emit Add Event
  updateProductQuantityHelper(productID: string, quantity: number) {
    try {
      this.eventEmitter.emit('cart.product.added', {
        productID,
        quantity,
      });
    } catch (error) {
      console.log('Error in event emitter', error);
    }
  }

  // Helper Method to Reduce Code Duplication & Emit Remove Event
  updateProductQuantityRemoveHelper(productID: string, quantity: number) {
    try {
      this.eventEmitter.emit('cart.product.removed', {
        productID,
        quantity,
      });
    } catch (error) {
      console.log('Error in event emitter', error);
    }
  }

  // Update the quantity of a product in the cart
  async updateProductQuantity(
    cartId: string,
    cartItemDto: CartItemDto,
  ): Promise<ShoppingCartDocument> {
    const cart = await this.getCart(cartId);
    const productObjectId = new Types.ObjectId(cartItemDto.product);
    console.log('Your cart items are...', cart.items);
    const index = cart.items.findIndex(
      (item) => item.product._id.toString() === productObjectId.toString(),
    );
    if (index === -1) {
      throw new NotFoundException(
        `Product with id ${cartItemDto.product} not found in the cart`,
      );
    }

    // Emit the event to update the product quantity
    const currentQuantity = cart.items[index].quantity;
    const newQuantity = cartItemDto.quantity;
    const quantityDifference = newQuantity - currentQuantity;
    if (quantityDifference > 0) {
      this.updateProductQuantityHelper(
        productObjectId.toString(),
        quantityDifference,
      );
    } else if (quantityDifference < 0) {
      this.updateProductQuantityRemoveHelper(
        productObjectId.toString(),
        Math.abs(quantityDifference),
      );
    }

    cart.items[index].quantity = cartItemDto.quantity;
    return cart.save();
  }

  // Delete a product from the cart
  async deleteProduct(
    cartId: string,
    productId: string,
  ): Promise<ShoppingCartDocument> {
    const cart = await this.getCart(cartId);
    const productObjectId = new Types.ObjectId(productId);
    // Find the product and determine how many units are being removed
    const item = cart.items.find(
      (item) => item.product._id.toString() === productObjectId.toString(),
    );
    if (!item) {
      throw new NotFoundException(
        `Product with id ${productId} not found in the cart`,
      );
    }

    // Emit an event indicating that units are being removed (stock should be increased)
    this.updateProductQuantityRemoveHelper(
      productObjectId.toString(),
      item.quantity,
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

    // Emit an event for each product in the cart
    cart.items.forEach((item) => {
      this.updateProductQuantityRemoveHelper(
        item.product.toString(),
        item.quantity,
      );
    });
    return cart;
  }
}
