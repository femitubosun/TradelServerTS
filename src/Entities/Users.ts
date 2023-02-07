import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from "typeorm";
import { CustomBaseEntity } from "./Base";
import { SettingsUserRoles } from "./SettingsUserRoles";
import { PasswordEncryptionProvider } from "Logic/Helpers";

@Entity()
export class Users extends CustomBaseEntity {
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
      this.password = PasswordEncryptionProvider.hashPassword(this.password);
      return this.password;
    }
  }
}
