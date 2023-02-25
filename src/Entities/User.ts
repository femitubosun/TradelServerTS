import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import { BaseEntity } from "./Base";
import { PasswordEncryptionHelper } from "Helpers/PasswordEncryptionHelper";

@Entity()
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

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

  @Column()
  roleId: number;

  @BeforeInsert()
  hashPassword() {
    if (this.password) {
      this.password = PasswordEncryptionHelper.hashPassword(this.password);
      return this.password;
    }
  }
}
