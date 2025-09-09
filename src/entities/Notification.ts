import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Module } from "./Module";
import { Status } from "./Status";
import { User } from "./User";

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  module_id: number;
  @ManyToOne(() => Module, { eager: true })
  @JoinColumn({ name: "module_id" })
  module: Module;

  @Column()
  ref_id: number;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "json", nullable: true })
  raw_data: any;

  @Column({ nullable: true })
  to_user_id: number;
  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: "to_user_id" })
  toUser: User;

  @Column({ default: 1 })
  status_id: number;
  @ManyToOne(() => Status, { eager: true })
  @JoinColumn({ name: "status_id" })
  status: Status;

  @CreateDateColumn({
    type: "timestamp",
    precision: 6,
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;

  @Column()
  created_by: number;
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "created_by" })
  createdBy: User;

  @UpdateDateColumn({
    type: "timestamp",
    precision: 6,
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  modified_at: Date;

  @Column({ nullable: true })
  updated_by: number;
  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: "updated_by" })
  updatedBy: User;
}
