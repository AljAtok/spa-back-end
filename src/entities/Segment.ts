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
import { Brand } from "./Brand";

@Entity("segments")
export class Segment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  segment_name: string;

  @Column({ length: 50 })
  segment_abbr: string;

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

  @ManyToOne(() => Brand, { eager: false, nullable: true })
  @JoinColumn({ name: "brand_id" })
  brand?: Brand;

  @Column({ nullable: true })
  brand_id?: number;
}
