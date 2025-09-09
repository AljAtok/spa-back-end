import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Warehouse } from "./Warehouse";
import { ItemCategory } from "./ItemCategory";
import { Status } from "./Status";
import { User } from "./User";
import { WarehouseHurdle } from "./WarehouseHurdle";

@Entity("warehouse_hurdle_categories")
export class WarehouseHurdleCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  warehouse_id: number;

  @Column()
  item_category_id: number;

  @Column({ default: 1 })
  status_id: number;

  @CreateDateColumn({
    type: "timestamp",
    precision: 6,
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;

  @Column({ nullable: true })
  created_by: number;

  @UpdateDateColumn({
    type: "timestamp",
    precision: 6,
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  modified_at: Date;

  @Column({ nullable: true })
  updated_by: number;

  @Column({ nullable: true })
  warehouse_hurdle_id: number;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: "warehouse_id" })
  warehouse: Warehouse;

  @ManyToOne(() => ItemCategory)
  @JoinColumn({ name: "item_category_id" })
  itemCategory: ItemCategory;

  @ManyToOne(() => Status)
  @JoinColumn({ name: "status_id" })
  status: Status;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  createdBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "updated_by" })
  updatedBy: User;

  @ManyToOne(() => WarehouseHurdle, { nullable: true })
  @JoinColumn({ name: "warehouse_hurdle_id" })
  warehouseHurdle: WarehouseHurdle;
}
