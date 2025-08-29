import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemResolver } from './order-item.resolver';

describe('OrderItemResolver', () => {
  let resolver: OrderItemResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderItemResolver],
    }).compile();

    resolver = module.get<OrderItemResolver>(OrderItemResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
