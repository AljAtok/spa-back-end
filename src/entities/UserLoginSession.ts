import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "user_login_sessions" })
export class UserLoginSession {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @Column({ type: "varchar", nullable: true })
  refresh_token!: string | null;

  @Column({ type: "timestamp", nullable: true })
  refresh_token_expires_at!: Date | null;

  @Column({ type: "timestamp", nullable: true })
  last_login!: Date | null;

  @Column({ type: "timestamp", nullable: true })
  last_logout!: Date | null;

  @Column({ default: false })
  is_logout!: boolean;

  @Column({ type: "varchar", nullable: true })
  device_info!: string | null;

  @Column({ type: "varchar", nullable: true })
  ip_address!: string | null;

  @Column({ type: "varchar", nullable: true })
  user_agent!: string | null;

  @Column({ default: true })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  modified_at!: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.loginSessions, { eager: false })
  @JoinColumn({ name: "user_id" })
  user!: User;
}
