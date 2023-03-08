import { Entity, Column } from "typeorm";
import { BaseEntity } from "Entities/Base";

@Entity()
export class SettingsUserRoles extends BaseEntity {
  @Column()
  name: string;
}
