import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Status } from "./Status";
import { AccessKey } from "./AccessKey";
import { User } from "./User";

@Entity("sales_budget_transactions")
@Index("idx_sales_budget_transactions_bc_code", ["bc_code"])
@Index("idx_sales_budget_transactions_ifs_code", ["ifs_code"])
@Index("idx_sales_budget_transactions_sales_month", ["sales_month"])
@Index("idx_sales_budget_transactions_material_code", ["material_code"])
export class SalesBudgetTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bc_name: string;

  @Column()
  bc_code: string;

  @Column()
  ifs_code: string;

  @Column()
  outlet_name: string;

  @Column("decimal", { precision: 18, scale: 2 })
  sales_det_qty: number;

  @Column("decimal", { precision: 18, scale: 2 })
  sales_det_qty_2: number;

  @Column()
  sales_month: number;

  @Column({ type: "date" })
  sales_date: string;

  @Column({ default: 1 })
  status_id: number;

  @ManyToOne(() => Status)
  @JoinColumn({ name: "status_id" })
  status: Status;

  @Column()
  access_key_id: number;

  @ManyToOne(() => AccessKey)
  @JoinColumn({ name: "access_key_id" })
  accessKey: AccessKey;

  @CreateDateColumn({
    type: "timestamp",
    precision: 6,
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    precision: 6,
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  modified_at: Date;

  @Column()
  material_code: string;

  @Column()
  material_desc: string;

  @Column()
  material_group_name: string;

  @Column({ type: "boolean", default: true })
  from_repo: boolean;

  @Column({ nullable: true })
  created_by: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "created_by" })
  createdByUser: User;

  @Column({ nullable: true })
  updated_by: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "updated_by" })
  updatedByUser: User;
}
