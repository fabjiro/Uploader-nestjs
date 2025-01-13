import { Module } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { DropboxService } from '../dropbox/dropbox.service';
import { UploaderLocalService } from './uploader.local.service';

@Module({
  providers: [UploaderService, DropboxService, UploaderLocalService],
  exports: [UploaderService, UploaderLocalService],
})
export class UploaderModule {}
