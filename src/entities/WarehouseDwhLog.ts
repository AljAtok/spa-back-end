import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("warehouse_dwh_logs")
export class WarehouseDwhLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  error: string;

  @Column({ type: "text", nullable: true })
  row_data: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;
}
