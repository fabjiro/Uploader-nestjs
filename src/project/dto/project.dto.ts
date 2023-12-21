import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;
}

export class UpdateProjectDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;
}
