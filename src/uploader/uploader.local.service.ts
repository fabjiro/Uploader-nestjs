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

    await fs.rename(pathLocal, join(destinationFolder, fileName));

    return {
      link: `http://localhost:${port}/${fileName}`,
      pathRemote: `http://localhost:${port}/${fileName}`,
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
