import { HttpException, Injectable } from '@nestjs/common';
import { FileCreateDto } from './dto/file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { ProjectService } from '../project/project.service';
import { UploaderService } from '../uploader/uploader.service';
import { Base64Utils } from '../utils/base64.utils';
import { ConstVar } from '../const';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly projectService: ProjectService,
    private readonly uploaderService: UploaderService,
  ) {}

  async create(projectId: string, fileData: FileCreateDto) {
    try {
      const { file } = fileData;
      const fileName = uuidv4();
      const project = await this.projectService.findOne(projectId);

      if (!project) {
        throw new HttpException('Projecto no disponible', 404);
      }

      const fileLocal = Base64Utils.base64ToFile(file);
      const fileExtension = Base64Utils.base64FileExtension(file);

      const fileUploader = await this.uploaderService.Uploader(
        fileLocal,
        `${ConstVar.pathUploader}/${project.userId}/${project.id}`,
        `${fileName}.${fileExtension}`,
      );

      return await this.fileRepository.save({
        id: fileName,
        projectId: project.id,
        link: fileUploader.link,
        pathRemote: fileUploader.pathRemote,
        fileType: fileExtension,
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
      return await this.fileRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw new HttpException(
        'Hemos tenido problemas procesando su peticion',
        500,
      );
    }
  }

  async findAllByUser(projectId: string, userId: string) {
    try {
      const project = await this.projectService.findOneBy({
        id: projectId,
        userId,
      });
      if (!project) {
        throw new HttpException('Proyecto no disponible', 404);
      }

      return await this.fileRepository.find({
        where: {
          projectId: project.id,
        },
      });
    } catch (error) {
      throw new HttpException('Hay problemas al procesar su peticion', 500);
    }
  }

  async removeByUserAndProject(
    projectId: string,
    userId: string,
    fileId: string,
  ) {
    try {
      const project = await this.projectService.findOneBy({
        id: projectId,
        userId,
      });

      if (!project) {
        throw new HttpException('Proyecto no disponible', 404);
      }

      const file = await this.fileRepository.findOneBy({
        id: fileId,
        projectId: project.id,
      });

      if (!file) {
        throw new HttpException('Archivo no disponible', 404);
      }

      await Promise.all([
        this.fileRepository.remove(file),
        this.uploaderService.Remove(file.pathRemote),
      ]);

      return true;
    } catch (error) {
      throw new HttpException('Hay problemas al procesar su peticion', 500);
    }
  }
}
