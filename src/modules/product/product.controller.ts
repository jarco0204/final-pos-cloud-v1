import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Product } from '../../schemas/Product';
import { ProductService } from './product.service';
import { CreateProductDto } from './validators/create-product-dto';
import { UpdateProductDto } from './validators/update-product-dto';
import { AIResponseInterceptor } from '../../interceptors/ai-response.interceptor';
import { createAIResponse } from '../../utils/ai-response.util';

@ApiTags('products')
@Controller('product')
@UseInterceptors(AIResponseInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateProductDto })
  async addProduct(@Body() createProductDto: CreateProductDto) {
    const startTime = Date.now();
    // const requestId = uuidv4();
    const requestId = '123';

    const product = await this.productService.create(createProductDto);

    return createAIResponse<Product>('/product', 'POST', requestId, startTime)
      .setData(product)
      .addHint(
        'info',
        'Product created successfully. You can now view, update, or delete this product.',
        'low',
      )
      .addNextStep(
        'View Product',
        'Get details of the created product',
        `/product/${product._id}`,
        'GET',
      )
      .addNextStep(
        'Update Product',
        'Modify the product details',
        `/product/${product._id}`,
        'PUT',
      )
      .addNextStep(
        'List Products',
        'View all products in inventory',
        '/product',
        'GET',
      )
      .setEcho(createProductDto)
      .build();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductById(@Param('id') id: string) {
    const startTime = Date.now();
    const requestId = '123';

    const product = await this.productService.findOne(id);

    const response = createAIResponse<Product>(
      '/product/:id',
      'GET',
      requestId,
      startTime,
    )
      .setData(product)
      .addNextStep(
        'Update Product',
        'Modify this product',
        `/product/${id}`,
        'PUT',
      )
      .addNextStep(
        'Delete Product',
        'Remove this product from inventory',
        `/product/${id}`,
        'DELETE',
      )
      .addNextStep('List Products', 'View all products', '/product', 'GET')
      .setEcho(undefined, { id });

    // Add stock warning if low
    if (product.stock < 10) {
      response.addHint(
        'warning',
        `Low stock alert: Only ${product.stock} items remaining`,
        'high',
      );
    }

    return response.build();
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of all products' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'sort', required: false, description: 'Sort field' })
  @ApiQuery({
    name: 'order',
    required: false,
    description: 'Sort order (asc/desc)',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search term' })
  getAllProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort?: string,
    @Query('order') order: 'asc' | 'desc' = 'asc',
    @Query('search') search?: string,
  ) {
    const startTime = Date.now();
    const requestId = '123';

    const filters: Record<string, any> = {};
    if (search) {
      filters.search = search;
    }

    // const result = await this.productService.findAll(
    //   page,
    //   limit,
    //   sort,
    //   order,
    //   search,
    // );
    const result = { products: [], total: 0 };

    const response = createAIResponse<Product[]>(
      '/product',
      'GET',
      requestId,
      startTime,
    );

    if (result.products.length === 0) {
      response.addHint(
        'warning',
        'No products found matching your criteria',
        'medium',
      );
    } else {
      response.addHint('info', `Found ${result.total} products`, 'low');
    }

    if (sort) {
      response.addHint(
        'info',
        `Results sorted by ${sort} in ${order}ending order`,
        'low',
      );
    }

    if (search) {
      response.addHint('info', `Search results for: "${search}"`, 'low');
    }

    response
      .addNextStep(
        'Create Product',
        'Add a new product to inventory',
        '/product',
        'POST',
      )
      .setEcho(undefined, { page, limit, sort, order, search }, filters, {
        page,
        limit,
        total: result.total,
      });

    return response.buildPaginated(result.products, page, limit, result.total);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiBody({ type: UpdateProductDto })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const startTime = Date.now();
    const requestId = '123';

    const product = await this.productService.update(id, updateProductDto);

    return createAIResponse<Product>(
      '/product/:id',
      'PUT',
      requestId,
      startTime,
    )
      .setData(product)
      .addHint('info', 'Product updated successfully', 'low')
      .addNextStep(
        'View Product',
        'Get updated product details',
        `/product/${id}`,
        'GET',
      )
      .addNextStep(
        'Delete Product',
        'Remove this product',
        `/product/${id}`,
        'DELETE',
      )
      .addNextStep('List Products', 'View all products', '/product', 'GET')
      .setEcho(updateProductDto, { id })
      .build();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Param('id') id: string) {
    const startTime = Date.now();
    const requestId = '123';

    await this.productService.delete(id);

    return createAIResponse<{ message: string }>(
      '/product/:id',
      'DELETE',
      requestId,
      startTime,
    )
      .setData({ message: 'Product deleted successfully' })
      .addHint(
        'info',
        'Product has been permanently removed from inventory',
        'medium',
      )
      .addNextStep(
        'List Products',
        'View remaining products',
        '/product',
        'GET',
      )
      .addNextStep('Create Product', 'Add a new product', '/product', 'POST')
      .setEcho(undefined, { id })
      .build();
  }
}
