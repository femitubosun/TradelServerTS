import { CustomBaseEntity } from "Entities/Base";
import { Column, Entity, ManyToOne } from "typeorm";
import { Users } from "../Users";
import { UserTokenTypesEnum } from "Entities/UserTokens";

@Entity()
export class UserTokens extends CustomBaseEntity {
  @ManyToOne(() => Users)
  user: Users;

  @Column({
    nullable: false,
  })
  token: string;

  @Column({
    type: "enum",
    enum: UserTokenTypesEnum,
  })
  type: UserTokenTypesEnum;
}
