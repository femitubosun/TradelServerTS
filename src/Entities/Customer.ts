import { BaseEntity } from "Entities/Base";
import { Entity, OneToOne, Column, JoinColumn } from "typeorm";
import { User } from "Entities/User";

@Entity()
export class Customer extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  phoneNumber: string;

  @Column({
    nullable: true,
  })
  userId: number;
}
