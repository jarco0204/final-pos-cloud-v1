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
import { CartItemDto } from './validators/update-shopping-cart.dto';

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

  // Add or update a product
  @Post(':id/product')
  async addOrUpdateProduct(
    @Param('id') cartId: string,
    @Body() cartItemDto: CartItemDto,
  ) {
    return this.cartService.addOrUpdateProduct(cartId, cartItemDto);
  }

  @Put(':id/product')
  async updateProductQuantity(
    @Param('id') cartId: string,
    @Body() cartItemDto: CartItemDto,
  ) {
    console.log('Your cart id is...', cartId, cartItemDto);
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
