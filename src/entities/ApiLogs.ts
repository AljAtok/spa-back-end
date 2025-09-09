import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ApiKey } from "./ApiKey";
import { Status } from "./Status";
import { User } from "./User";

@Entity("api_logs")
export class ApiLogs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  uri: string;

  @Column({ type: "varchar", length: 6 })
  method: string;

  @Column({ type: "text", nullable: true })
  params: string;

  @Column({ type: "int", nullable: true })
  api_key_id: number;

  @Column({ type: "varchar", length: 45, nullable: true })
  ip_address: string;

  @Column({ type: "datetime" })
  time: Date;

  @Column({ type: "tinyint", nullable: true })
  authorized: number;

  @Column({ type: "int", nullable: true })
  response_code: number;

  @Column({ type: "int" })
  status_id: number;

  @CreateDateColumn({
    type: "timestamp",
    precision: 6,
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;

  @ManyToOne(() => ApiKey)
  @JoinColumn({ name: "api_key_id" })
  apiKey: ApiKey;

  @ManyToOne(() => Status)
  @JoinColumn({ name: "status_id" })
  status: Status;
}
