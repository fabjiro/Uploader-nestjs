import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FileCreateDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo file es requerido' })
  file: string;
}
