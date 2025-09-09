import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Status } from "./Status";
import { User } from "./User";
import { Segment } from "./Segment";

@Entity("brand_groups")
export class BrandGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  brand_group_name: string;

  @Column({ length: 50 })
  brand_group_abbr: string;

  @Column({ default: 1 })
  status_id: number;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  modified_at: Date;

  @ManyToOne(() => Status, { eager: false })
  @JoinColumn({ name: "status_id" })
  status: Status;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: "created_by" })
  createdBy: User;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: "updated_by" })
  updatedBy: User;

  @ManyToOne(() => Segment, { eager: false, nullable: true })
  @JoinColumn({ name: "segment_id" })
  segment?: Segment;

  @Column({ nullable: true })
  segment_id?: number;
}
