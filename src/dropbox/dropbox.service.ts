import { Injectable } from '@nestjs/common';
import { Dropbox } from 'dropbox';
import { createReadStream } from 'fs';
import { basename, extname } from 'path';

@Injectable()
export class DropboxService {
  private readonly dbx: Dropbox;

  constructor() {
    this.dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN });
  }

  async createFolder(path: string): Promise<boolean> {
    try {
      await this.dbx.filesCreateFolderV2({ path, autorename: true });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteFile(pathCloud: string): Promise<boolean> {
    try {
      await this.dbx.filesDeleteV2({ path: pathCloud });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async existPath(path: string): Promise<boolean> {
    try {
      await this.dbx.filesGetMetadata({ path });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async sharedLink(pathCloud: string): Promise<string> {
    try {
      const response = await this.dbx.sharingCreateSharedLink({
        path: pathCloud,
      });
      return response.result.url.replace(
        'https://www.dropbox.com/',
        'https://dl.dropboxusercontent.com/',
      );
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  async upload(localPath: string, cloudPath: string) {
    try {
      const fileStream = createReadStream(localPath);
      const response = await this.dbx.filesUpload({
        path: cloudPath,
        contents: fileStream,
        strict_conflict: false,
      });

      return {
        name: basename(localPath, extname(localPath)),
        path: response.result.path_display,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
