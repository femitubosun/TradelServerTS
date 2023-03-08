import { Entity, Column } from "typeorm";
import { BaseEntity } from "./Base";

@Entity()
export class SettingsUserRoles extends BaseEntity {
  @Column()
  name: string;
}
