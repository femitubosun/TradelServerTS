import { DataSource } from "typeorm";
import { dbConfig } from "AppConfig/dbConfig";
import {
  Users,
  SettingsUserRoles,
  Customers,
  UserTokens,
} from "Entities/index";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  username: dbConfig.USERNAME,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB_NAME,
  entities: [SettingsUserRoles, Users, Customers, UserTokens],
  synchronize: true,
});

export const TestDataSource = new DataSource({
  type: "postgres",
  host: dbConfig.TEST_HOST,
  port: dbConfig.TEST_PORT,
  username: dbConfig.TEST_USERNAME,
  password: dbConfig.TEST_PASSWORD,
  database: dbConfig.TEST_DB_NAME,
  entities: [SettingsUserRoles, Users],
  synchronize: true,
});
