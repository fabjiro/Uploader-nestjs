import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpException,
  Get,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { FileCreateDto } from './dto/file.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('file')
@ApiTags('File')
@ApiBearerAuth()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async uploadFile(
    @Req() request: any,
    @Body() createProjectDto: FileCreateDto,
  ) {
    const { userId, projectId } = request.user;
    if (!userId || !projectId) {
      throw new HttpException('Verifique sus credenciales', 404);
    }

    return await this.fileService.create(projectId, createProjectDto);
  }

  @Post('form')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file')) // 'file' debe coincidir con el nombre del campo en el formulario
  async uploadFileForm(
    @Req() request: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { userId, projectId } = request.user;

    if (!userId || !projectId) {
      throw new HttpException('Verifique sus credenciales', 404);
    }

    return await this.fileService.createByForm(projectId, file);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getFileByUser(@Req() request: any) {
    const { userId, projectId } = request.user;

    if (!userId || !projectId) {
      throw new HttpException('Verifique sus credenciales', 404);
    }

    return this.fileService.findAllByUser(projectId, userId);
  }

  @Get(':project')
  @UseGuards(JwtAuthGuard)
  async getFileByProject(@Param('project') projectId: string) {
    return this.fileService.findAllByProject(projectId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteFileByUserAndProkect(@Req() req: any, @Param('id') id: string) {
    const { userId, projectId } = req.user;
    return await this.fileService.removeByUserAndProject(projectId, userId, id);
  }
}
