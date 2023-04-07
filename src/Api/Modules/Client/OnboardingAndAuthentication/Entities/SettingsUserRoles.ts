import { Entity, Column } from "typeorm";
import { BaseEntity } from "Entities/Base";

@Entity("settings_user_roles")
export class SettingsUserRoles extends BaseEntity {
  @Column()
  name: string;
}
