import { CustomBaseEntity } from "Entities/Base";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { User } from "../User";
import { UserTokenTypesEnum } from "Entities/UserTokens";
import { DateTime } from "luxon";

@Entity()
export class UserTokens extends CustomBaseEntity {
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({
    nullable: true,
  })
  userId: number;

  @Column({
    nullable: false,
  })
  token: string;

  @Column({
    type: "enum",
    enum: UserTokenTypesEnum,
  })
  type: UserTokenTypesEnum;

  @Column({
    type: "timestamp",
  })
  expiresOn: DateTime;

  @Column({
    default: false,
  })
  expired: boolean;
}
