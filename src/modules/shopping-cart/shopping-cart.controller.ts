import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShoppingCartService } from './shopping-cart.service';
import { CartItemDto } from './validators/create-shopping-cart-item.dto';

@ApiTags('shopping-cart')
@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly cartService: ShoppingCartService) {}

  @Post()
  async createCart() {
    return this.cartService.createCart();
  }

  @Get(':id')
  async getCart(@Param('id') id: string) {
    return this.cartService.getCart(id);
  }

  @Put(':id/product')
  async addProduct(
    @Param('id') cartId: string,
    @Body() cartItemDto: CartItemDto,
  ) {
    return this.cartService.addProduct(cartId, cartItemDto);
  }

  // Add or update a product
  @Post(':id/product/:productId')
  async updateProductQuantity(
    @Param('id') cartId: string,
    @Body() cartItemDto: CartItemDto,
  ) {
    return this.cartService.updateProductQuantity(cartId, cartItemDto);
  }

  @Delete(':id/product/:productId')
  async deleteProduct(
    @Param('id') cartId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.deleteProduct(cartId, productId);
  }

  @Delete(':id')
  async deleteCart(@Param('id') id: string) {
    return this.cartService.deleteCart(id);
  }
}
