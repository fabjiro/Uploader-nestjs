import { HttpException, Injectable } from '@nestjs/common';
import { UpdateProjectDto } from './dto/project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly userService: UserService,
  ) {}

  async create(name: string, userId: string) {
    try {
      const userData = await this.userService.findOne(userId);

      if (!userData) {
        throw new HttpException('Usuario no disponible', 404);
      }

      return await this.projectRepository.save({
        name: name,
        userId: userData.id,
      });
    } catch (error) {
      throw new HttpException(
        'Hemos tenido problemas procesando su peticion',
        500,
      );
    }
  }

  async findAllProjectByUser(userId: string) {
    try {
      const user = await this.userService.findOne(userId);
      return await this.projectRepository.find({
        where: {
          userId: user.id,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Hemos tenido problemas procesando su peticion',
        500,
      );
    }
  }

  async findOne(id: string) {
    try {
      return await this.projectRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw new HttpException(
        'Hemos tenido problemas procesando su peticion',
        500,
      );
    }
  }

  async findOneBy(project: Partial<Project>) {
    try {
      return await this.projectRepository.findOneBy(project);
    } catch (error) {
      throw new HttpException(
        'Hemos tenido problemas procesando su peticion',
        500,
      );
    }
  }

  async findOneByUserId(projectId: string, userId: string) {
    try {
      return await this.projectRepository.findOneBy({
        userId: userId,
        id: projectId,
      });
    } catch (error) {
      throw new HttpException(
        'Hemos tenido problemas procesando su peticion',
        500,
      );
    }
  }

  async updateByuser(
    id: string,
    userId: string,
    updateProjectDto: UpdateProjectDto,
  ) {
    try {
      await this.findOneByUserId(id, userId);
      return await this.projectRepository.update(id, updateProjectDto);
    } catch (error) {
      throw new HttpException(
        'Hemos tenido problemas procesando su peticion',
        500,
      );
    }
  }

  async remove(id: string) {
    try {
      const project = await this.findOne(id);
      return await this.projectRepository.remove(project);
    } catch (error) {
      throw new HttpException(
        'Hemos tenido problemas procesando su peticion',
        500,
      );
    }
  }

  async removeByUser(projectId: string, idUser: string) {
    try {
      const project = await this.findOneByUserId(projectId, idUser);
      return await this.projectRepository.remove(project);
    } catch (error) {
      throw new HttpException(
        'Hemos tenido problemas procesando su peticion',
        500,
      );
    }
  }
}
