import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Status } from "./Status";

@Entity()
export class Theme {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  theme_name!: string;

  @Column({ unique: true })
  theme_abbr!: string;

  @Column()
  status_id!: number;

  @CreateDateColumn()
  created_at!: Date;

  @Column()
  created_by!: number;

  @Column({ nullable: true })
  updated_by!: number | null;

  @UpdateDateColumn()
  modified_at!: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.createdThemes)
  @JoinColumn({ name: "created_by" })
  createdBy!: User;

  @ManyToOne(() => User, (user) => user.updatedThemes)
  @JoinColumn({ name: "updated_by" })
  updatedBy!: User | null;
  @ManyToOne(() => Status, (status) => status.themes, { eager: false })
  @JoinColumn({ name: "status_id" })
  status!: Status;

  // Relationship for theme_id in User
  @OneToMany(() => User, (user) => user.theme)
  users!: User[];
}
