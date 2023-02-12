import { CustomBaseEntity } from "Entities/Base";
import { Entity, OneToOne, Column, JoinColumn } from "typeorm";
import { User } from "Entities/User";

@Entity()
export class Merchant extends CustomBaseEntity {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  phoneNumber: string;

  @Column({
    nullable: true,
  })
  storeNameSlug: string;

  @Column()
  storeName: string;

  @Column({ nullable: true })
  userId: number;
}
