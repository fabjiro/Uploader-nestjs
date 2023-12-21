import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El correo es requerido' })
  @IsEmail(
    {},
    {
      message: 'El correo debe ser una dirección de correo electrónico válida',
    },
  )
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;
}

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El correo es requerido' })
  @IsEmail(
    {},
    {
      message: 'El correo debe ser una dirección de correo electrónico válida',
    },
  )
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;
}

export class LoginByProjectDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Proyecto id es requerido' })
  projectId: string;
}
