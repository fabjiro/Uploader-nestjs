import { Injectable } from '@nestjs/common';
import { IUploaderService } from './interfaces/IUploaderService';
import { IUploader } from './interfaces/IUploader';
import { DropboxService } from '../dropbox/dropbox.service';

@Injectable()
export class UploaderService implements IUploaderService {
  constructor(private readonly dropboxService: DropboxService) {}
  async Remove(pathRemote: string): Promise<boolean> {
    try {
      const isExistPath = await this.dropboxService.existPath(pathRemote);
      if (!isExistPath) {
        throw new Error('Path remote no existe');
      }
      await this.dropboxService.deleteFile(pathRemote);
      return true;
    } catch (error) {
      return false;
    }
  }
  async Uploader(
    pathLocal: string,
    toRemote: string,
    fileName: string,
  ): Promise<IUploader> {
    const isExistPath = await this.dropboxService.existPath(toRemote);
    if (!isExistPath) {
      await this.dropboxService.createFolder(toRemote);
    }

    const pathCloud = `${toRemote}/${fileName}`;
    const dataFile = await this.dropboxService.upload(pathLocal, pathCloud);
    const linkFile = await this.dropboxService.sharedLink(pathCloud);

    return {
      link: linkFile,
      pathRemote: dataFile.path,
    };
  }
}
