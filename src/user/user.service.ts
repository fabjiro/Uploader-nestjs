import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { EncryptionService } from '../utils/encrypt.utils';
import { RegisterDto } from '../auth/dto/authDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly encriptService: EncryptionService,
  ) {}

  async create(createUserDto: RegisterDto) {
    const { email, name, password } = createUserDto;
    const user = await this.findByEmial(email);

    if (user) return null;

    return this.userRepository.save({
      email: email,
      name: name,
      password: await this.encriptService.hashPassword(password),
    });
  }

  findByEmial(email: string) {
    return this.userRepository.findOneBy({
      email: email,
    });
  }

  findOne(id: string) {
    return this.userRepository.findOneBy({
      id,
    });
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (user == null) return null;
    return this.userRepository.remove(user);
  }
}
