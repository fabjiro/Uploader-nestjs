import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  name: number;

  @ApiProperty()
  email: string;
}
