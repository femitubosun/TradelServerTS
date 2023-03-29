import { DataSource } from "typeorm";
import { dbConfig } from "Config/index";
import {
  SettingsUserRoles,
  User,
  UserTokens,
} from "Api/Modules/Client/OnboardingAndAuthentication/Entities";
import { Customer, Merchant } from "Api/Modules/Client/Profile/Entities";
import {
  Wallet,
  InternalTransaction,
  TransactionDetails,
} from "Api/Modules/Client/Finance/Entities";
import {
  PurchaseOrder,
  PurchaseOrderItem,
  SalesOrder,
} from "Api/Modules/Client/Order/Entities";
import { ProductCategory } from "Api/Modules/Client/Inventory/Entities/ProductCategory";
import {
  Cart,
  CartItem,
  Product,
  Collection,
  ProductVariant,
  ProductVariantOptions,
} from "Api/Modules/Client/Inventory/Entities";

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
    CartItem,
    Merchant,
    Collection,
    ProductCategory,
    ProductVariant,
    ProductVariantOptions,
    Product,
    Wallet,
    InternalTransaction,
    PurchaseOrder,
    PurchaseOrderItem,
    SalesOrder,
    TransactionDetails,
    // SalesOrderItem,
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
