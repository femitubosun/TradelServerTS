import {
  PrimaryGeneratedColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated("uuid")
  identifier: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({ default: false })
  isDeleted: boolean;
}
