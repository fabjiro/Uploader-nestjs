import { Injectable } from '@nestjs/common';
import { IUploaderService } from './interfaces/IUploaderService';
import { IUploader } from './interfaces/IUploader';
import { join } from 'path';
import { promises as fs } from 'fs';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UploaderLocalService implements IUploaderService {
  constructor(private configService: ConfigService) {}

  async Uploader(
    pathLocal: string,
    toRemote: string,
    fileName: string,
  ): Promise<IUploader | undefined> {
    const port = this.configService.get<string>('PORT');
    const destinationFolder = join(__dirname, '..', 'public'); // Carpeta de destino

    await fs.mkdir(destinationFolder, { recursive: true });

    await fs.copyFile(pathLocal, join(destinationFolder, fileName));
    await fs.unlink(pathLocal);

    return {
      link: `http://localhost:${port}/public/${fileName}`,
      pathRemote: join(destinationFolder, fileName),
    };
  }
  async Remove(pathRemote: string): Promise<boolean> {
    try {
      await fs.unlink(pathRemote);
      return true;
    } catch (error) {
      return false;
    }
  }
}
