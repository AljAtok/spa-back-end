import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Location } from "./Location";
import { Status } from "./Status";
import { AccessKey } from "./AccessKey";
import { User } from "./User";
import { TransactionDetail } from "./TransactionDetail";

@Entity({ name: "transaction_headers" })
export class TransactionHeader {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
  trans_date: string;

  @ManyToOne(() => Location)
  @JoinColumn({ name: "location_id" })
  location: Location;

  @Column()
  location_id: number;

  @ManyToOne(() => Status)
  @JoinColumn({ name: "status_id" })
  status: Status;

  @Column({ default: 1 })
  status_id: number;

  @ManyToOne(() => AccessKey)
  @JoinColumn({ name: "access_key_id" })
  access_key: AccessKey;

  @Column()
  access_key_id: number;

  @CreateDateColumn({
    type: "timestamp",
    precision: 6,
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  created_by_user: User;

  @Column({ nullable: true })
  created_by: number;

  @UpdateDateColumn({
    type: "timestamp",
    precision: 6,
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  modified_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "updated_by" })
  updated_by_user: User;

  @Column({ nullable: true })
  updated_by: number;

  @OneToMany(() => TransactionDetail, (detail) => detail.transaction_header)
  details: TransactionDetail[];

  @Column({ type: "varchar", length: 32, nullable: true })
  trans_number: string;

  @Column({ type: "text", nullable: true })
  cancel_reason?: string;

  @Column({ type: "text", nullable: true })
  undo_reason?: string;
}
