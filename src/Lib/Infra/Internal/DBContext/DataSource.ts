import { DataSource } from "typeorm";
import { dbConfig } from "Config/dbConfig";
import {
  SettingsUserRoles,
  User,
  UserTokens,
} from "Api/Modules/Client/OnboardingAndAuthentication/Entities";
import { Customer, Merchant } from "Api/Modules/Client/Profile/Entities";
import {
  InternalTransaction,
  TransactionDetails,
  Wallet,
  ExternalTransaction,
} from "Api/Modules/Client/Finance/Entities";
import {
  PurchaseOrder,
  PurchaseOrderItem,
  SalesOrder,
} from "Api/Modules/Client/Order/Entities";
import {
  Cart,
  CartItem,
  Collection,
  Product,
  ProductVariant,
  ProductVariantOptions,
} from "Api/Modules/Client/Inventory/Entities";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { InventoryMigrations1680900370122 } from "Api/Modules/Client/Inventory/Migrations/1680900370122-InventoryMigrations";
import { OnboardingAndAuthenticationMigrations1680901444848 } from "Api/Modules/Client/OnboardingAndAuthentication/Migrations/1680901444848-OnboardingAndAuthenticationMigrations";
import { ProfileMigrations1680901792744 } from "Api/Modules/Client/Profile/Migrations/1680901792744-ProfileMigrations";
import { FinanceMigrations1680901883138 } from "Api/Modules/Client/Finance/Migrations/1680901883138-FinanceMigrations";
import { OrderMigrations1680902127593 } from "Api/Modules/Client/Order/Migrations/1680902127593-OrderMigrations";
import { ExternalTransaction1681888952091 } from "Api/Modules/Client/Finance/Migrations/1681888952091-ExternalTransaction";

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
    UserTokens,
    Cart,
    CartItem,
    Collection,
    ProductVariant,
    ProductVariantOptions,
    Product,
    Merchant,
    Customer,
    Wallet,
    InternalTransaction,
    ExternalTransaction,
    TransactionDetails,
    PurchaseOrder,
    PurchaseOrderItem,
    SalesOrder,
  ],
  migrations: [
    InventoryMigrations1680900370122,
    OnboardingAndAuthenticationMigrations1680901444848,
    ProfileMigrations1680901792744,
    FinanceMigrations1680901883138,
    OrderMigrations1680902127593,
    ExternalTransaction1681888952091,
  ],
  namingStrategy: new SnakeNamingStrategy(),
});
