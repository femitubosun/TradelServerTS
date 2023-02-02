import { Entity, Column, ManyToOne } from "typeorm";
import { CustomBaseEntity } from "Domain/Base";
import { SettingsUserRoles } from "Domain/Entities/SettingsUserRoles";

@Entity()
export class Users extends CustomBaseEntity {
  //    Todo RELATIONSHIP
  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({
    default: true,
  })
  isFirstTimeLogin: boolean;

  @Column({
    default: false,
  })
  hasVerifiedEmail: boolean;

  @Column({
    nullable: true,
  })
  lastLoginDate: Date;

  @ManyToOne(() => SettingsUserRoles)
  role: SettingsUserRoles;
}

// export const UserRepository = AppDataSource.getRepository(Users);
