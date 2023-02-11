import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from "typeorm";
import { CustomBaseEntity } from "./Base";
import { SettingsUserRoles } from "./SettingsUserRoles";
import { PasswordEncryptionHelper } from "Helpers/PasswordEncryptionHelper";
import { DateTime } from "luxon";

@Entity()
export class User extends CustomBaseEntity {
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

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password) {
      this.password = PasswordEncryptionHelper.hashPassword(this.password);
      return this.password;
    }
  }
}
