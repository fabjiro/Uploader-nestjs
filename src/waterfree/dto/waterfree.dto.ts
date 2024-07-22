import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class WaterFreeDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'La identidad es requerida' })
  identity: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El username es requeido' })
  username: string;
}
