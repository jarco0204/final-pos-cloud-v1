/* eslint-disable @typescript-eslint/no-base-to-string */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShoppingCart, ShoppingCartDocument } from 'src/schemas/ShoppingCart';
import { CreateCartDto } from './validators/create-shopping-cart.dto';
import { CartItemDto } from './validators/update-shopping-cart.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectModel(ShoppingCart.name)
    private cartModel: Model<ShoppingCartDocument>,
  ) {}

  // Create a new shopping cart
  async createCart(createCartDto: CreateCartDto): Promise<ShoppingCart> {
    const newCart = new this.cartModel(createCartDto);
    return newCart.save();
  }

  // Get a cart by ID
  async getCart(cartId: string): Promise<ShoppingCart> {
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
  ): Promise<ShoppingCart> {
    const cart = await this.getCart(cartId);
    // Check if product already exists in the cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === cartItemDto.product,
    );
    if (existingItem) {
      // Increase the quantity
      existingItem.quantity += cartItemDto.quantity;
    } else {
      // Push new cart item
      cart.items.push(cartItemDto);
    }
    return cart.save();
  }

  // Update quantity of a product in the cart
  async updateProductQuantity(
    cartId: string,
    cartItemDto: CartItemDto,
  ): Promise<ShoppingCart> {
    const cart = await this.getCart(cartId);
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === cartItemDto.product,
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
  ): Promise<ShoppingCart> {
    const cart = await this.getCart(cartId);
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );
    return cart.save();
  }

  // Delete the entire shopping cart
  async deleteCart(cartId: string): Promise<ShoppingCart> {
    const cart = await this.cartModel.findByIdAndDelete(cartId).exec();
    if (!cart) {
      throw new NotFoundException(`Cart with id ${cartId} not found`);
    }
    return cart;
  }
}
