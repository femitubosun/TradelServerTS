import { CustomBaseEntity } from "Entities/Base";
import { Entity, OneToOne, Column, JoinColumn } from "typeorm";
import { Users } from "Entities/Users";

@Entity()
export class Customers extends CustomBaseEntity {
  @OneToOne(() => Users)
  @JoinColumn()
  user: Users;

  @Column({
    nullable: true,
  })
  userId: number;
}
