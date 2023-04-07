import { MigrationInterface, QueryRunner } from "typeorm";

export class InventoryMigrations1680900370122 implements MigrationInterface {
  name = "InventoryMigrations1680900370122";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "products"
            (
                "id"                    SERIAL            NOT NULL,
                "identifier"            uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "name"                  character varying NOT NULL,
                "name_slug"             character varying NOT NULL,
                "description"           character varying NOT NULL,
                "base_price"            double precision  NOT NULL,
                "stock"                 integer           NOT NULL DEFAULT '1',
                "merchant_id"           integer           NOT NULL,
                "document_with_weights" tsvector          NOT NULL,
                "created_at"            TIMESTAMP         NOT NULL DEFAULT now(),
                "updated_at"            TIMESTAMP         NOT NULL DEFAULT now(),
                "is_active"             boolean           NOT NULL DEFAULT true,
                "is_deleted"            boolean           NOT NULL DEFAULT false,
                CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_4c9fb58de893725258746385e1" ON "products" ("name")
        `);
    await queryRunner.query(`
            CREATE TABLE "product_variants"
            (
                "id"              SERIAL            NOT NULL,
                "identifier"      uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "sku"             character varying NOT NULL,
                "price"           double precision  NOT NULL,
                "stock"           integer           NOT NULL DEFAULT '1',
                "photo_url"       character varying,
                "product_id"      integer,
                "parent_variants" text array        NOT NULL,
                "created_at"      TIMESTAMP         NOT NULL DEFAULT now(),
                "updated_at"      TIMESTAMP         NOT NULL DEFAULT now(),
                "is_active"       boolean           NOT NULL DEFAULT true,
                "is_deleted"      boolean           NOT NULL DEFAULT false,
                CONSTRAINT "PK_281e3f2c55652d6a22c0aa59fd7" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "cart_items"
            (
                "id"                 SERIAL    NOT NULL,
                "identifier"         uuid      NOT NULL DEFAULT uuid_generate_v4(),
                "cart_id"            integer,
                "product_variant_id" integer,
                "product_id"         integer,
                "is_product"         boolean   NOT NULL DEFAULT true,
                "quantity"           integer   NOT NULL DEFAULT '1',
                "created_at"         TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at"         TIMESTAMP NOT NULL DEFAULT now(),
                "is_active"          boolean   NOT NULL DEFAULT true,
                "is_deleted"         boolean   NOT NULL DEFAULT false,
                CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "carts"
            (
                "id"          SERIAL    NOT NULL,
                "customer_id" integer,
                "identifier"  uuid      NOT NULL DEFAULT uuid_generate_v4(),
                "created_at"  TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at"  TIMESTAMP NOT NULL DEFAULT now(),
                "is_active"   boolean   NOT NULL DEFAULT true,
                "is_deleted"  boolean   NOT NULL DEFAULT false,
                CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "collections"
            (
                "id"          SERIAL            NOT NULL,
                "identifier"  uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "merchant_id" integer           NOT NULL,
                "label"       character varying NOT NULL,
                "slug"        character varying,
                "image_url"   character varying,
                "created_at"  TIMESTAMP         NOT NULL DEFAULT now(),
                "updated_at"  TIMESTAMP         NOT NULL DEFAULT now(),
                "is_active"   boolean           NOT NULL DEFAULT true,
                "is_deleted"  boolean           NOT NULL DEFAULT false,
                CONSTRAINT "PK_21c00b1ebbd41ba1354242c5c4e" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "product_variant_options"
            (
                "id"              SERIAL    NOT NULL,
                "identifier"      uuid      NOT NULL DEFAULT uuid_generate_v4(),
                "variant_options" jsonb,
                "product_id"      integer,
                "created_at"      TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at"      TIMESTAMP NOT NULL DEFAULT now(),
                "is_active"       boolean   NOT NULL DEFAULT true,
                "is_deleted"      boolean   NOT NULL DEFAULT false,
                CONSTRAINT "REL_b8031a2eab5e8f638f353de9d3" UNIQUE ("product_id"),
                CONSTRAINT "PK_cd62d81fd4813d94bfd1ef7cda5" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "collections_items_products"
            (
                "collections_id" integer NOT NULL,
                "products_id"    integer NOT NULL,
                CONSTRAINT "PK_58680db11b00e77ad556bc8eb23" PRIMARY KEY ("collections_id", "products_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_e745cc5e93d02c41b356f2b3e8" ON "collections_items_products" ("collections_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_e4869ab557938509b9c10d273e" ON "collections_items_products" ("products_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_variants"
                ADD CONSTRAINT "FK_6343513e20e2deab45edfce1316" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "cart_items"
                ADD CONSTRAINT "FK_6385a745d9e12a89b859bb25623" FOREIGN KEY ("cart_id") REFERENCES "carts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "cart_items"
                ADD CONSTRAINT "FK_de29bab7b2bb3b49c07253275f1" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "cart_items"
                ADD CONSTRAINT "FK_30e89257a105eab7648a35c7fce" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product_variant_options"
                ADD CONSTRAINT "FK_b8031a2eab5e8f638f353de9d38" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "collections_items_products"
                ADD CONSTRAINT "FK_e745cc5e93d02c41b356f2b3e8c" FOREIGN KEY ("collections_id") REFERENCES "collections" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "collections_items_products"
                ADD CONSTRAINT "FK_e4869ab557938509b9c10d273eb" FOREIGN KEY ("products_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "collections_items_products"
                DROP CONSTRAINT "FK_e4869ab557938509b9c10d273eb"
        `);
    await queryRunner.query(`
            ALTER TABLE "collections_items_products"
                DROP CONSTRAINT "FK_e745cc5e93d02c41b356f2b3e8c"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_variant_options"
                DROP CONSTRAINT "FK_b8031a2eab5e8f638f353de9d38"
        `);
    await queryRunner.query(`
            ALTER TABLE "cart_items"
                DROP CONSTRAINT "FK_30e89257a105eab7648a35c7fce"
        `);
    await queryRunner.query(`
            ALTER TABLE "cart_items"
                DROP CONSTRAINT "FK_de29bab7b2bb3b49c07253275f1"
        `);
    await queryRunner.query(`
            ALTER TABLE "cart_items"
                DROP CONSTRAINT "FK_6385a745d9e12a89b859bb25623"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_variants"
                DROP CONSTRAINT "FK_6343513e20e2deab45edfce1316"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_e4869ab557938509b9c10d273e"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_e745cc5e93d02c41b356f2b3e8"
        `);
    await queryRunner.query(`
            DROP TABLE "collections_items_products"
        `);
    await queryRunner.query(`
            DROP TABLE "product_variant_options"
        `);
    await queryRunner.query(`
            DROP TABLE "collections"
        `);
    await queryRunner.query(`
            DROP TABLE "carts"
        `);
    await queryRunner.query(`
            DROP TABLE "cart_items"
        `);
    await queryRunner.query(`
            DROP TABLE "product_variants"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_4c9fb58de893725258746385e1"
        `);
    await queryRunner.query(`
            DROP TABLE "products"
        `);
  }
}
