import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Status } from "./Status";
import { RoleActionPreset } from "./RoleActionPreset";
import { UserPermissions } from "./UserPermissions";

@Entity()
export class Module {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  module_name!: string;

  @Column({ unique: true })
  module_alias!: string;

  @Column()
  module_link!: string;

  @Column()
  menu_title!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  parent_title!: string | null;
  @Column()
  link_name!: string;

  @Column({ type: "int" })
  order_level!: number;

  // Foreign key to Status entity
  @ManyToOne(() => Status, (status) => status.modules, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: "status_id" })
  status!: Status;

  @Column({ default: 1 })
  status_id!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  // Foreign key to User entity for created_by
  @ManyToOne(() => User, (user) => user.createdModules, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: "created_by" })
  createdBy!: User;

  @Column()
  created_by!: number;

  // Foreign key to User entity for updated_by
  @ManyToOne(() => User, (user) => user.updatedModules, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: "updated_by" })
  updatedBy?: User;

  @Column({ nullable: true })
  updated_by?: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  modified_at!: Date;

  // Relationship for module_id in RoleActionPreset
  @OneToMany(() => RoleActionPreset, (preset) => preset.module)
  roleActionPresets!: RoleActionPreset[];

  // Relationship for module_id in UserPermissions
  @OneToMany(() => UserPermissions, (userPermissions) => userPermissions.module)
  userPermissions!: UserPermissions[];
}
