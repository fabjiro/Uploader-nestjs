import { Module } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { DropboxService } from '../dropbox/dropbox.service';

@Module({
  providers: [UploaderService, DropboxService],
  exports: [UploaderService],
})
export class UploaderModule {}
