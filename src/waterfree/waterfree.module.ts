import { Module } from '@nestjs/common';
import { WaterfreeService } from './waterfree.service';
import { WaterfreeController } from './waterfree.controller';

@Module({
  controllers: [WaterfreeController],
  providers: [WaterfreeService],
})
export class WaterfreeModule {}
