import { ApiProperty } from '@nestjs/swagger';
import { IsBase64, IsNotEmpty } from 'class-validator';

export class FileCreateDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo file es requerido' })
  @IsBase64({ message: 'El campo file debe ser base64' })
  file: string;
}
