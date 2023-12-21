import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { LoginByProjectDto, LoginDto, RegisterDto } from './dto/authDto';
import { Response } from 'express'; // Correct import statement
import { JwtAuthGuard } from './guards/auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una cuenta' })
  @ApiBody({ type: RegisterDto })
  async create(
    @Body() createUserDto: RegisterDto,
    @Res() res: Response,
  ): Promise<UserDto> {
    const data = await this.authService.register(createUserDto);

    if (data === null) {
      res.status(HttpStatus.CONFLICT).json({
        status: HttpStatus.CONFLICT,
        message: 'Correo existente',
      });
      return;
    }

    res.status(HttpStatus.OK).json(data);
    return;
  }

  @Post('/login')
  @ApiOperation({ summary: 'Authentificacion de usuario' })
  @ApiBody({ type: LoginDto })
  async Login(@Body() loginData: LoginDto, @Res() res: Response) {
    const data = await this.authService.login(loginData);
    res.status(HttpStatus.OK).json(data);
    return;
  }

  @Post('/login/project')
  @ApiOperation({ summary: 'Authentificacion de projecto' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  // @ApiBody({ type: LoginDto })
  async LogiinByProject(
    @Body() loginData: LoginByProjectDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const { projectId } = loginData;
    const { userId } = req.user;
    const data = await this.authService.loginByProject(userId, projectId);
    res.status(HttpStatus.OK).json(data);
    return;
  }
}
