import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Position } from "./Position";
import { Status } from "./Status";
import { User } from "./User";
import { AccessKey } from "./AccessKey";
import { EmployeeLocation } from "./EmployeeLocation";

@Entity("employees")
@Unique(["employee_number"])
@Unique(["employee_number", "employee_first_name", "employee_last_name"])
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  employee_number: string;

  @Column()
  employee_first_name: string;

  @Column()
  employee_last_name: string;

  @Column({ nullable: true, unique: true })
  employee_email: string;

  @Column()
  position_id: number;

  @Column({ default: 1 })
  status_id: number;

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

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @Column({ nullable: true })
  access_key_id: number;

  @ManyToOne(() => Position)
  @JoinColumn({ name: "position_id" })
  position: Position;

  @ManyToOne(() => Status)
  @JoinColumn({ name: "status_id" })
  status: Status;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  createdBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "updated_by" })
  updatedBy: User;

  @ManyToOne(() => AccessKey)
  @JoinColumn({ name: "access_key_id" })
  accessKey: AccessKey;

  @OneToMany(() => EmployeeLocation, (el) => el.employee)
  employee_locations: EmployeeLocation[];
}
