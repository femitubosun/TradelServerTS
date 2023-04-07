import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderMigrations1680902127593 implements MigrationInterface {
  name = "OrderMigrations1680902127593";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "purchase_order_items"
            (
                "id"                 SERIAL    NOT NULL,
                "identifier"         uuid      NOT NULL DEFAULT uuid_generate_v4(),
                "order_id"           integer,
                "product_variant_id" integer,
                "product_id"         integer,
                "is_product"         boolean   NOT NULL DEFAULT true,
                "quantity"           integer   NOT NULL,
                "cost"               double precision,
                "created_at"         TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at"         TIMESTAMP NOT NULL DEFAULT now(),
                "is_active"          boolean   NOT NULL DEFAULT true,
                "is_deleted"         boolean   NOT NULL DEFAULT false,
                CONSTRAINT "PK_e8b7568d25c41e3290db596b312" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."purchase_orders_status_enum" AS ENUM('pending', 'processed', 'invalid')
        `);
    await queryRunner.query(`
            CREATE TABLE "purchase_orders"
            (
                "id"          SERIAL                                 NOT NULL,
                "identifier"  uuid                                   NOT NULL DEFAULT uuid_generate_v4(),
                "customer_id" integer                                NOT NULL,
                "cost"        double precision,
                "status"      "public"."purchase_orders_status_enum" NOT NULL DEFAULT 'pending',
                "created_at"  TIMESTAMP                              NOT NULL DEFAULT now(),
                "updated_at"  TIMESTAMP                              NOT NULL DEFAULT now(),
                "is_active"   boolean                                NOT NULL DEFAULT true,
                "is_deleted"  boolean                                NOT NULL DEFAULT false,
                CONSTRAINT "PK_05148947415204a897e8beb2553" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."sales_orders_status_enum" AS ENUM('pending', 'processed', 'invalid')
        `);
    await queryRunner.query(`
            CREATE TABLE "sales_orders"
            (
                "id"                 SERIAL                              NOT NULL,
                "identifier"         uuid                                NOT NULL DEFAULT uuid_generate_v4(),
                "customer_id"        integer                             NOT NULL,
                "purchase_order_id"  integer,
                "merchant_id"        integer                             NOT NULL,
                "product_variant_id" integer,
                "is_product"         boolean                             NOT NULL DEFAULT true,
                "product_id"         integer,
                "quantity"           integer                             NOT NULL DEFAULT '1',
                "cost"               double precision,
                "status"             "public"."sales_orders_status_enum" NOT NULL DEFAULT 'pending',
                "created_at"         TIMESTAMP                           NOT NULL DEFAULT now(),
                "updated_at"         TIMESTAMP                           NOT NULL DEFAULT now(),
                "is_active"          boolean                             NOT NULL DEFAULT true,
                "is_deleted"         boolean                             NOT NULL DEFAULT false,
                CONSTRAINT "PK_5328297e067ca929fbe7cf989dd" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "purchase_order_items"
                ADD CONSTRAINT "FK_c133e834562c02eb4061813938f" FOREIGN KEY ("order_id") REFERENCES "purchase_orders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "sales_orders"
                ADD CONSTRAINT "FK_79b77a6a0adcf9c6cda4ab5f51d" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "sales_orders"
                DROP CONSTRAINT "FK_79b77a6a0adcf9c6cda4ab5f51d"
        `);
    await queryRunner.query(`
            ALTER TABLE "purchase_order_items"
                DROP CONSTRAINT "FK_c133e834562c02eb4061813938f"
        `);
    await queryRunner.query(`
            DROP TABLE "sales_orders"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."sales_orders_status_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "purchase_orders"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."purchase_orders_status_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "purchase_order_items"
        `);
  }
}
