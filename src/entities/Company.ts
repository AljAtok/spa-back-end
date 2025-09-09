import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Status } from "./Status";
import { AccessKey } from "./AccessKey";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ unique: true })
  company_name!: string;

  @Column({ unique: true })
  company_abbr!: string;

  @Column()
  status_id!: number;

  @CreateDateColumn()
  created_at!: Date;

  @Column()
  created_by!: number;

  @Column({ nullable: true })
  updated_by!: number | null;

  @UpdateDateColumn()
  modified_at!: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.createdCompanies)
  @JoinColumn({ name: "created_by" })
  createdBy!: User;

  @ManyToOne(() => User, (user) => user.updatedCompanies)
  @JoinColumn({ name: "updated_by" })
  updatedBy!: User | null;

  @ManyToOne(() => Status, (status) => status.companies, { eager: false })
  @JoinColumn({ name: "status_id" })
  status!: Status;

  @OneToMany(() => AccessKey, (accessKey) => accessKey.company)
  accessKeys!: AccessKey[];
}
