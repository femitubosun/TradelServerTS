import { CustomBaseEntity } from "Entities/Base";
import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "../User";
import { UserTokenTypesEnum } from "Entities/UserTokens";

@Entity()
export class UserTokens extends CustomBaseEntity {
  @ManyToOne(() => User)
  user: User;

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
    default: false,
  })
  expired: boolean;
}
