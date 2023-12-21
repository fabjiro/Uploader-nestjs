import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { ProjectModule } from '../project/project.module';
import { UploaderModule } from '../uploader/uploader.module';

@Module({
  imports: [TypeOrmModule.forFeature([File]), ProjectModule, UploaderModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
