import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

// Local Imports
import { ShoppingCart, ShoppingCartDocument } from '../../schemas/ShoppingCart';
import { CartItemDto } from './validators/create-shopping-cart-item.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectModel(ShoppingCart.name)
    private cartModel: Model<ShoppingCartDocument>,
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
      // Increase the quantity
      cart.items[existingIndex].quantity += cartItemDto.quantity;
    } else {
      // Add new product to cart
      cart.items.push({
        product: productObjectId,
        quantity: cartItemDto.quantity,
      });
    }
    return cart.save();
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
    cart.items = cart.items.filter(
      (item) => item.product._id.toString() !== productObjectId.toString(),
    );
    return cart.save();
  }

  // Delete the entire cart
  async deleteCart(cartId: string): Promise<ShoppingCartDocument> {
    const cart = await this.cartModel.findByIdAndDelete(cartId).exec();
    if (!cart) {
      throw new NotFoundException(`Cart with id ${cartId} not found`);
    }
    return cart;
  }
}
