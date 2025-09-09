import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";
import { User } from "./User";
import { Role } from "./Role";
import { Module } from "./Module";
import { Action } from "./Action";
import { AccessKey } from "./AccessKey";
import { Status } from "./Status";

@Entity({ name: "user_permissions" })
@Unique("UQ_user_role_module_action_access", [
  "user_id",
  "role_id",
  "module_id",
  "action_id",
  "access_key_id",
])
export class UserPermissions {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  user_id!: number;

  @Column()
  role_id!: number;

  @Column()
  module_id!: number;

  @Column()
  action_id!: number;

  @Column()
  access_key_id!: number;

  @Column({ default: 1 })
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
  @ManyToOne(() => User, (user) => user.userPermissions, { eager: false })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Role, (role) => role.userPermissions, { eager: false })
  @JoinColumn({ name: "role_id" })
  role!: Role;

  @ManyToOne(() => Module, (module) => module.userPermissions, { eager: false })
  @JoinColumn({ name: "module_id" })
  module!: Module;

  @ManyToOne(() => Action, (action) => action.userPermissions, { eager: false })
  @JoinColumn({ name: "action_id" })
  action!: Action;

  @ManyToOne(() => AccessKey, (accessKey) => accessKey.userPermissions, {
    eager: false,
  })
  @JoinColumn({ name: "access_key_id" })
  accessKey!: AccessKey;

  @ManyToOne(() => Status, (status) => status.userPermissions, { eager: false })
  @JoinColumn({ name: "status_id" })
  status!: Status;

  @ManyToOne(() => User, (user) => user.createdUserPermissions, {
    eager: false,
  })
  @JoinColumn({ name: "created_by" })
  createdBy!: User;

  @ManyToOne(() => User, (user) => user.updatedUserPermissions, {
    eager: false,
  })
  @JoinColumn({ name: "updated_by" })
  updatedBy!: User;
}
