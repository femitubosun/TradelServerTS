import { DataSource } from "typeorm";
import { dbConfig } from "AppConfig/dbConfig";
import { Users, SettingsUserRoles } from "Domain/Entities";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  username: dbConfig.USERNAME,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB_NAME,
  entities: [SettingsUserRoles, Users],
  synchronize: true,
});
