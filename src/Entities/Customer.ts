import { CustomBaseEntity } from "Entities/Base";
import { Entity, OneToOne, Column, JoinColumn } from "typeorm";
import { User } from "Entities/User";

@Entity()
export class Customer extends CustomBaseEntity {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({
    nullable: true,
  })
  userId: number;
}
