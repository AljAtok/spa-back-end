import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ItemCategory } from "./ItemCategory";
import { Status } from "./Status";
import { User } from "./User";

@Entity({ name: "items" })
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  item_code: string;

  @Column()
  item_name: string;

  @Column()
  item_group: string;

  @Column()
  uom: string;

  @Column()
  uom_sa: string;

  @Column({ nullable: true })
  category1_id: number;

  @ManyToOne(() => ItemCategory, { nullable: true })
  @JoinColumn({ name: "category1_id" })
  category1: ItemCategory;

  @Column({ nullable: true })
  category2_id: number;

  @ManyToOne(() => ItemCategory, { nullable: true })
  @JoinColumn({ name: "category2_id" })
  category2: ItemCategory;

  @Column("decimal", { precision: 15, scale: 6 })
  sales_conv: number;

  @Column("decimal", { precision: 15, scale: 6 })
  sales_unit_eq: number;

  @Column({ default: 1 })
  status_id: number;

  @ManyToOne(() => Status)
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

  @ManyToOne(() => User)
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

  @ManyToOne(() => User)
  @JoinColumn({ name: "updated_by" })
  updatedBy: User;
}
