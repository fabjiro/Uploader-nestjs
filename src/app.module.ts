import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { ProjectModule } from './project/project.module';
import { EncryptionService } from './utils/encrypt.utils';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { UploaderModule } from './uploader/uploader.module';
import { DropboxService } from './dropbox/dropbox.service';
import { WaterfreeModule } from './waterfree/waterfree.module';

@Module({
  imports: [
    // ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URL + '?sslmode=require', // or process.env.POSTGRES_URL_NON_POOLING for non-pooling connection
      entities: ['./dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    UserModule,
    FileModule,
    ProjectModule,
    AuthModule,
    UploaderModule,
    WaterfreeModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, EncryptionService, DropboxService],
  exports: [EncryptionService],
})
export class AppModule {}
