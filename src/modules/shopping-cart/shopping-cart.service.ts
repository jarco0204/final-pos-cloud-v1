/* eslint-disable @typescript-eslint/no-base-to-string */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ShoppingCart, ShoppingCartDocument } from '../../schemas/ShoppingCart';
import { CreateCartDto } from './validators/create-shopping-cart.dto';
import { CartItemDto } from './validators/update-shopping-cart.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectModel(ShoppingCart.name)
    private cartModel: Model<ShoppingCartDocument>,
  ) {}

  // Create a new shopping cart
  async createCart(
    createCartDto: CreateCartDto,
  ): Promise<ShoppingCartDocument> {
    const newCart = new this.cartModel(createCartDto);
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

  // Add a product to the cart
  async addProduct(
    cartId: string,
    cartItemDto: CartItemDto,
  ): Promise<ShoppingCartDocument> {
    const cart = await this.getCart(cartId);
    // Convert the product string to a Mongoose ObjectId
    const productObjectId = new Types.ObjectId(cartItemDto.product);
    // Check if product already exists in the cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productObjectId.toString(),
    );
    if (existingItem) {
      // Increase the quantity
      existingItem.quantity += cartItemDto.quantity;
    } else {
      // Add new cart item
      cart.items.push({
        product: productObjectId,
        quantity: cartItemDto.quantity,
      });
    }
    return cart.save();
  }

  // Update quantity of a product in the cart
  async updateProductQuantity(
    cartId: string,
    cartItemDto: CartItemDto,
  ): Promise<ShoppingCartDocument> {
    const cart = await this.getCart(cartId);
    const productObjectId = new Types.ObjectId(cartItemDto.product);
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productObjectId.toString(),
    );
    if (itemIndex === -1) {
      throw new NotFoundException(
        `Product with id ${cartItemDto.product} not found in the cart`,
      );
    }
    cart.items[itemIndex].quantity = cartItemDto.quantity;
    return cart.save();
  }

  // Delete a product from the cart
  async deleteProduct(
    cartId: string,
    productId: string,
  ): Promise<ShoppingCartDocument> {
    const cart = await this.getCart(cartId);
    const productObjectId = new Types.ObjectId(productId);
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productObjectId.toString(),
    );
    return cart.save();
  }

  // Delete the entire shopping cart
  async deleteCart(cartId: string): Promise<ShoppingCartDocument> {
    const cart = await this.cartModel.findByIdAndDelete(cartId).exec();
    if (!cart) {
      throw new NotFoundException(`Cart with id ${cartId} not found`);
    }
    return cart;
  }
}
