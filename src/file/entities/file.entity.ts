import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from '../../project/entities/project.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  link: string;

  @Column()
  pathRemote: string;

  @Column()
  fileType: string;

  @Column('uuid')
  projectId: string;

  @ManyToOne(() => Project, (project) => project.files)
  @JoinColumn({ name: 'projectId' })
  project: Project;
}
