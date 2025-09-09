import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ApiKey } from "./ApiKey";
import { Status } from "./Status";
import { User } from "./User";

@Entity("api_auth_access")
export class ApiAuthAccess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  api_key_id: number;

  @Column({ type: "varchar", length: 255 })
  api_method: string;

  @Column({ type: "tinyint", default: 1 })
  all_access: number;

  @Column({ type: "varchar", length: 255 })
  controller_url: string;

  @Column({ type: "int" })
  status_id: number;

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
  @ManyToOne(() => ApiKey)
  @JoinColumn({ name: "api_key_id" })
  apiKey: ApiKey;

  @ManyToOne(() => Status)
  @JoinColumn({ name: "status_id" })
  status: Status;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  createdBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "updated_by" })
  updatedBy: User;
}
