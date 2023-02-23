import { DataSource } from "typeorm";
import { dbConfig } from "Config/index";
import {
  User,
  SettingsUserRoles,
  Customer,
  UserTokens,
  Cart,
  Merchant,
  ProductCategory,
  Product,
} from "Entities/index";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.dbName,
  entities: [
    SettingsUserRoles,
    User,
    Customer,
    UserTokens,
    Cart,
    Merchant,
    ProductCategory,
    Product,
  ],
  synchronize: true,
});

export const TestDataSource = new DataSource({
  type: "postgres",
  host: dbConfig.testHost,
  port: dbConfig.testPort,
  username: dbConfig.testUsername,
  password: dbConfig.testPassword,
  database: dbConfig.testDbName,
  entities: [SettingsUserRoles, User],
  synchronize: true,
});
