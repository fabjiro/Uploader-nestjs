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
import { UploaderLocalService } from '../uploader/uploader.local.service';
import { IUploader } from '../uploader/interfaces/IUploader';
import { ConfigService } from '@nestjs/config';
import { ModeEnum } from '../enum/mode.enum';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly projectService: ProjectService,
    private readonly uploaderService: UploaderService,
    private readonly uploaderLocalService: UploaderLocalService,
    private configService: ConfigService,
  ) {}

  async create(projectId: string, fileData: FileCreateDto) {
    try {
      const mode = this.configService.get<string>('MODE');
      const { file } = fileData;
      const fileId = uuidv4();
      const project = await this.projectService.findOne(projectId);

      if (!project) {
        throw new HttpException('Projecto no disponible', 404);
      }

      const fileLocal = Base64Utils.base64ToFile(file);
      const fileExtension = Base64Utils.base64FileExtension(file);

      let fileUploader: IUploader;

      const pathRemote = `${ConstVar.pathUploader}/${project.userId}/${project.id}`;
      const fileName = `${fileId}.${fileExtension}`;

      if (mode === ModeEnum.REMOTE) {
        fileUploader = await this.uploaderService.Uploader(
          fileLocal,
          pathRemote,
          fileName,
        );
      } else if (mode === ModeEnum.LOCAL) {
        fileUploader = await this.uploaderLocalService.Uploader(
          fileLocal,
          pathRemote,
          fileName,
        );
      }

      return await this.fileRepository.save({
        id: fileId,
        projectId: project.id,
        link: fileUploader.link,
        pathRemote: fileUploader.pathRemote,
        fileType: fileExtension,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Hemos tenido problemas procesando su peticion',
        500,
      );
    }
  }

  async createByForm(projectId: string, file: Express.Multer.File) {
    try {
      const project = await this.projectService.findOne(projectId);

      if (!project) {
        throw new HttpException('Projecto no disponible', 404);
      }
      const tempDir = os.tmpdir();
      const fileId = uuidv4();
      const fileExtension = path.extname(file.originalname);

      const fileLocal = `${tempDir}/${fileId}${fileExtension}`;
      const pathRemote = `${ConstVar.pathUploader}/${project.userId}/${project.id}`;

      fs.writeFileSync(fileLocal, file.buffer);

      const fileName = `${fileId}.${fileExtension}`;

      const fileUploader = await this.uploaderService.Uploader(
        fileLocal,
        pathRemote,
        fileName,
      );

      fs.unlinkSync(fileLocal);

      return await this.fileRepository.save({
        id: fileId,
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

  async findAllByProject(projectId: string) {
    try {
      return await this.fileRepository.find({
        where: {
          projectId,
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
