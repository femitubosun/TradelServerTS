import { Entity, Column } from "typeorm";
import { CustomBaseEntity } from "./Base";

@Entity()
export class SettingsUserRoles extends CustomBaseEntity {
  @Column()
  name: string;
}
