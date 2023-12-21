import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('project')
@ApiTags('Project')
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() request: any, @Body() createProjectDto: CreateProjectDto) {
    const { userId } = request.user;
    return this.projectService.create(createProjectDto.name, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllByUser(@Req() request: any) {
    const { userId } = request.user;
    return this.projectService.findAllProjectByUser(userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateByUser(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() request: any,
  ) {
    const { userId } = request.user;

    return this.projectService.updateByuser(id, userId, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removeByUser(@Param('id') id: string, @Req() request: any) {
    const { userId } = request.user;
    return this.projectService.removeByUser(id, userId);
  }
}
