import { CustomBaseEntity } from "Entities/Base";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { DateTime } from "luxon";
import { UserTokenTypesEnum } from "src/TypeChecking/UserTokens/UserTokenTypesEnum";

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
  tokenType: UserTokenTypesEnum;

  @Column({
    type: "timestamp",
  })
  expiresOn: DateTime;

  @Column({
    default: false,
  })
  expired: boolean;
}
