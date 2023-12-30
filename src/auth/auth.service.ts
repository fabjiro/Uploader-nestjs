import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto/authDto';
import { EncryptionService } from '../utils/encrypt.utils';
import { JwtService } from '@nestjs/jwt';
import { ProjectService } from '../project/project.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
    private readonly encriptService: EncryptionService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const userRegister = await this.userService.create(data);

    if (userRegister == null) return null;

    return {
      name: userRegister.name,
      email: userRegister.email,
      token: this.jwtService.sign(
        {
          userId: userRegister.id,
        },
        {
          expiresIn: '1d',
        },
      ),
    };
  }

  async login(data: LoginDto) {
    const { email, password } = data;
    const userRegister = await this.userService.findByEmial(email);

    if (userRegister == null) {
      throw new HttpException('User not found', 404);
    }
    const isValidPassword = await this.encriptService.comparePasswords(
      password,
      userRegister.password,
    );

    if (!isValidPassword) {
      throw new HttpException('Datos incorrectos', 403);
    }

    return {
      name: userRegister.name,
      email: userRegister.email,
      token: this.jwtService.sign(
        {
          userId: userRegister.id,
        },
        {
          expiresIn: '1d',
        },
      ),
    };
  }

  async loginByProject(userId: string, projectId: string) {
    const [user, project] = await Promise.all([
      this.userService.findOne(userId),
      this.projectService.findOne(projectId),
    ]);

    if (!user || !project) {
      throw new HttpException('Usuario o Proyecto no disponibles', 404);
    }

    return {
      name: user.name,
      email: user.email,
      token: this.jwtService.sign(
        {
          userId: user.id,
          projectId: project.id,
        },
        {
          expiresIn: '1y',
        },
      ),
    };
  }
}
