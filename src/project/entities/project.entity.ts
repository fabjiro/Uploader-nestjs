import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { File } from '../../file/entities/file.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.projects)
  user: User;

  @OneToMany(() => File, (file) => file.project)
  files: File[];
}
