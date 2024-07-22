import { Test, TestingModule } from '@nestjs/testing';
import { WaterfreeService } from './waterfree.service';

describe('WaterfreeService', () => {
  let service: WaterfreeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WaterfreeService],
    }).compile();

    service = module.get<WaterfreeService>(WaterfreeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
