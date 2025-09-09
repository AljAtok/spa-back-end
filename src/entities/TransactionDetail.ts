import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { TransactionHeader } from "./TransactionHeader";
import { Warehouse } from "./Warehouse";
import { Status } from "./Status";

@Entity({ name: "transaction_details" })
export class TransactionDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TransactionHeader, (header) => header.details)
  @JoinColumn({ name: "transaction_header_id" })
  transaction_header: TransactionHeader;

  @Column()
  transaction_header_id: number;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: "warehouse_id" })
  warehouse: Warehouse;

  @Column()
  warehouse_id: number;

  @Column({ type: "decimal", precision: 18, scale: 2 })
  budget_volume: number;

  @Column({ type: "decimal", precision: 18, scale: 2 })
  ss_hurdle_qty: number;

  @Column({ type: "decimal", precision: 18, scale: 6 })
  sales_qty: number;

  @Column({ type: "decimal", precision: 18, scale: 2 })
  rate: number;

  @ManyToOne(() => Status)
  @JoinColumn({ name: "status_id" })
  status: Status;

  @Column({ default: 1 })
  status_id: number;

  @Column({ type: "decimal", precision: 18, scale: 2, nullable: true })
  budget_volume_monthly: number;
}
