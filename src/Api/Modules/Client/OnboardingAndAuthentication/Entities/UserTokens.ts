import { BaseEntity } from "Entities/Base";
import { Column, Entity } from "typeorm";
import { DateTime } from "luxon";
import { UserTokenTypesEnum } from "../TypeChecking/UserTokens";

@Entity("user_tokens")
export class UserTokens extends BaseEntity {
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

  //TODO rename to hasExpired
  @Column({
    default: false,
  })
  expired: boolean;
}
