import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Status } from "./Status";
import { AccessKey } from "./AccessKey";
import { User } from "./User";

@Entity("api_keys")
export class ApiKey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  api_keys: string;

  @Column({ type: "int" })
  level: number;

  @Column({ type: "tinyint", default: 1 })
  ignore_limits: number;

  @Column({ type: "tinyint", default: 1 })
  is_private_key: number;

  @Column({ type: "varchar", length: 45, nullable: true })
  ip_address: string;

  @Column({ type: "int" })
  status_id: number;

  @Column({ type: "int" })
  access_key_id: number;

  @CreateDateColumn({
    type: "timestamp",
    precision: 6,
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;

  @Column({ type: "int" })
  created_by: number;

  @UpdateDateColumn({
    type: "timestamp",
    precision: 6,
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  modified_at: Date;

  @Column({ type: "int" })
  updated_by: number;

  // Relations
  @ManyToOne(() => Status)
  @JoinColumn({ name: "status_id" })
  status: Status;

  @ManyToOne(() => AccessKey)
  @JoinColumn({ name: "access_key_id" })
  accessKey: AccessKey;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  createdBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "updated_by" })
  updatedBy: User;
}
