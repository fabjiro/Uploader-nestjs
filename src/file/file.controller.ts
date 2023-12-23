import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpException,
  Get,
} from '@nestjs/common';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { FileCreateDto } from './dto/file.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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

  @Get()
  @UseGuards(JwtAuthGuard)
  async getFileByUser(@Req() request: any) {
    const { userId, projectId } = request.user;

    if (!userId || !projectId) {
      throw new HttpException('Verifique sus credenciales', 404);
    }

    return this.fileService.findAllByUser(projectId, userId);
  }
}
