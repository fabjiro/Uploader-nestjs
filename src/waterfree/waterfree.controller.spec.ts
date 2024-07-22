import { Test, TestingModule } from '@nestjs/testing';
import { WaterfreeController } from './waterfree.controller';
import { WaterfreeService } from './waterfree.service';

describe('WaterfreeController', () => {
  let controller: WaterfreeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaterfreeController],
      providers: [WaterfreeService],
    }).compile();

    controller = module.get<WaterfreeController>(WaterfreeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
