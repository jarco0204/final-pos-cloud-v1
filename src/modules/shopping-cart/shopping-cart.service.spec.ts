import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';

// Local Imports
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCart } from 'src/schemas/ShoppingCart';

// Create a default cart instance for static methods
const mockCartInstance = {
  _id: 'cart-id-123',
  items: [],
  save: jest.fn().mockResolvedValue(true),
};

// Create a newable mock constructor for ShoppingCart
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const shoppingCartModelMock = jest.fn().mockImplementation((dto) => ({
  ...dto,
  _id: 'new-cart-id',
  save: jest.fn().mockResolvedValue({ _id: 'new-cart-id', ...dto }),
}));

// Attach static methods to the mock constructor
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
(shoppingCartModelMock as any).findById = jest.fn().mockReturnValue({
  populate: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(mockCartInstance),
});
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
(shoppingCartModelMock as any).findByIdAndDelete = jest.fn().mockReturnValue({
  exec: jest.fn().mockResolvedValue(mockCartInstance),
});

const eventEmitterMock = {
  emit: jest.fn(),
};

describe('ShoppingCartService', () => {
  let service: ShoppingCartService;
  let model: Model<ShoppingCart>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingCartService,
        {
          provide: getModelToken(ShoppingCart.name),
          useValue: shoppingCartModelMock,
        },
        {
          provide: EventEmitter2,
          useValue: eventEmitterMock,
        },
      ],
    }).compile();

    service = module.get<ShoppingCartService>(ShoppingCartService);
    model = module.get<Model<ShoppingCart>>(getModelToken(ShoppingCart.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a cart', async () => {
    const result = await service.createCart();
    expect(result).toBeTruthy();
    // We expect the mock constructor to have been called with the new cart data
    expect(shoppingCartModelMock).toHaveBeenCalledWith({ items: [] });
  });

  it('should get a cart by id', async () => {
    const result = await service.getCart('cart-id-123');
    expect(result).toEqual(mockCartInstance);
  });
});
