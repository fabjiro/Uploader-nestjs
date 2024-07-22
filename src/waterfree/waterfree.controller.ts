import { Controller, Post, Body } from '@nestjs/common';
import { WaterfreeService } from './waterfree.service';
import { WaterFreeDto } from './dto/waterfree.dto';

@Controller('waterfree')
export class WaterfreeController {
  constructor(private readonly waterfreeService: WaterfreeService) {}

  @Post()
  create(@Body() createWaterfreeDto: WaterFreeDto) {
    return this.waterfreeService.generate(createWaterfreeDto);
  }
}
