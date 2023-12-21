import { IUploader } from './IUploader';

export interface IUploaderService {
  Uploader(
    pathLocal: string,
    toRemote: string,
    fileName: string,
  ): Promise<IUploader | undefined>;

  Remove(pathRemote: string): Promise<boolean>;
}
