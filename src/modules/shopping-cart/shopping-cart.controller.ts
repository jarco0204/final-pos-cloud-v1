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
import { CreateCartDto } from './validators/create-shopping-cart.dto';

@ApiTags('shopping-cart')
@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly cartService: ShoppingCartService) {}

  @Post()
  async createCart(@Body() createCartDto: CreateCartDto) {
    return this.cartService.createCart(createCartDto);
  }

  @Get(':id')
  async getCart(@Param('id') id: string) {
    return this.cartService.getCart(id);
  }

  @Post(':id/product')
  async addProduct(
    @Param('id') cartId: string,
    @Body() cartItemDto: CartItemDto,
  ) {
    return this.cartService.addProduct(cartId, cartItemDto);
  }

  @Put(':id/product')
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
