import { Test, TestingModule } from '@nestjs/testing';
import { ProductLikeResolver } from './product-like.resolver';
import { ProductLikeService } from './product-like.service';

describe('ProductLikeResolver', () => {
  let resolver: ProductLikeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductLikeResolver, ProductLikeService],
    }).compile();

    resolver = module.get<ProductLikeResolver>(ProductLikeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
