import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ShoppingCartService } from './shopping-cart.service';
import { CartItemDto } from './validators/create-shopping-cart-item.dto';

@ApiTags('shopping-cart')
@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly cartService: ShoppingCartService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shopping cart' })
  @ApiResponse({
    status: 201,
    description: 'Shopping cart created successfully',
  })
  async createCart() {
    return this.cartService.createCart();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a shopping cart by ID' })
  @ApiParam({ name: 'id', description: 'Shopping cart ID' })
  @ApiResponse({ status: 200, description: 'Shopping cart found' })
  @ApiResponse({ status: 404, description: 'Shopping cart not found' })
  async getCart(@Param('id') id: string) {
    return this.cartService.getCart(id);
  }

  @Put(':id/product')
  @ApiOperation({ summary: 'Add a product to shopping cart' })
  @ApiParam({ name: 'id', description: 'Shopping cart ID' })
  @ApiResponse({
    status: 200,
    description: 'Product added to cart successfully',
  })
  @ApiResponse({ status: 404, description: 'Shopping cart not found' })
  @ApiBody({ type: CartItemDto })
  async addProduct(
    @Param('id') cartId: string,
    @Body() cartItemDto: CartItemDto,
  ) {
    return this.cartService.addProduct(cartId, cartItemDto);
  }

  @Post(':id/product/:productId')
  @ApiOperation({ summary: 'Update product quantity in cart' })
  @ApiParam({ name: 'id', description: 'Shopping cart ID' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product quantity updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Shopping cart or product not found',
  })
  @ApiBody({ type: CartItemDto })
  async updateProductQuantity(
    @Param('id') cartId: string,
    @Body() cartItemDto: CartItemDto,
  ) {
    return this.cartService.updateProductQuantity(cartId, cartItemDto);
  }

  @Delete(':id/product/:productId')
  @ApiOperation({ summary: 'Remove a product from shopping cart' })
  @ApiParam({ name: 'id', description: 'Shopping cart ID' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product removed from cart successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Shopping cart or product not found',
  })
  async deleteProduct(
    @Param('id') cartId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.deleteProduct(cartId, productId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shopping cart' })
  @ApiParam({ name: 'id', description: 'Shopping cart ID' })
  @ApiResponse({
    status: 200,
    description: 'Shopping cart deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Shopping cart not found' })
  async deleteCart(@Param('id') id: string) {
    return this.cartService.deleteCart(id);
  }
}
