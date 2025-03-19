import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { Model } from 'mongoose';
import { Product } from 'src/schemas/Product';

// A sample product for testing
const mockProduct = {
  _id: 'product-id-123',
  name: 'Test Product',
  description: 'A product for testing',
  price: 29.99,
  stock: 100,
};

// Create a newable mock for the product model:
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const productModelMock = jest.fn().mockImplementation((dto) => ({
  ...dto,
  _id: 'new-product-id',
  save: jest.fn().mockResolvedValue({ _id: 'new-product-id', ...dto }),
})) as unknown as Model<Product>;

// Attach static methods as needed:
productModelMock.find = jest.fn().mockReturnValue({
  exec: jest.fn().mockResolvedValue([mockProduct]),
});
productModelMock.findById = jest.fn().mockReturnValue({
  exec: jest.fn().mockResolvedValue(mockProduct),
});
productModelMock.findByIdAndUpdate = jest.fn().mockReturnValue({
  exec: jest.fn().mockResolvedValue({ ...mockProduct, stock: 90 }),
});
productModelMock.findByIdAndDelete = jest.fn().mockReturnValue({
  exec: jest.fn().mockResolvedValue(mockProduct),
});

describe('ProductService', () => {
  let service: ProductService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let model: Model<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken(Product.name),
          useValue: productModelMock,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    model = module.get<Model<Product>>(getModelToken(Product.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    const dto = {
      name: 'New Product',
      description: 'desc',
      price: 10,
      stock: 50,
      image: 'image-url',
    };
    const result = await service.create(dto);
    expect(result).toHaveProperty('_id', 'new-product-id');
    expect(productModelMock).toHaveBeenCalledWith(dto);
  });

  // Additional tests for update, delete, etc.
});
