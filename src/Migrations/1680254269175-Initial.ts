import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1680254269175 implements MigrationInterface {
  name = "Initial1680254269175";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user"
            (
                "id"               SERIAL            NOT NULL,
                "identifier"       uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt"        TIMESTAMP         NOT NULL DEFAULT now(),
                "updatedAt"        TIMESTAMP         NOT NULL DEFAULT now(),
                "isActive"         boolean           NOT NULL DEFAULT true,
                "isDeleted"        boolean           NOT NULL DEFAULT false,
                "firstName"        character varying NOT NULL,
                "lastName"         character varying NOT NULL,
                "email"            character varying NOT NULL,
                "password"         character varying NOT NULL,
                "isFirstTimeLogin" boolean           NOT NULL DEFAULT true,
                "hasVerifiedEmail" boolean           NOT NULL DEFAULT false,
                "lastLoginDate"    TIMESTAMP,
                "roleId"           integer           NOT NULL,
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "settings_user_roles"
            (
                "id"         SERIAL            NOT NULL,
                "identifier" uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt"  TIMESTAMP         NOT NULL DEFAULT now(),
                "updatedAt"  TIMESTAMP         NOT NULL DEFAULT now(),
                "isActive"   boolean           NOT NULL DEFAULT true,
                "isDeleted"  boolean           NOT NULL DEFAULT false,
                "name"       character varying NOT NULL,
                CONSTRAINT "PK_4bbd21d348745391ad1702a6a59" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."user_tokens_tokentype_enum" AS ENUM('access', 'refresh', 'email', 'passwordReset')
        `);
    await queryRunner.query(`
            CREATE TABLE "user_tokens"
            (
                "id"         SERIAL                                NOT NULL,
                "identifier" uuid                                  NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt"  TIMESTAMP                             NOT NULL DEFAULT now(),
                "updatedAt"  TIMESTAMP                             NOT NULL DEFAULT now(),
                "isActive"   boolean                               NOT NULL DEFAULT true,
                "isDeleted"  boolean                               NOT NULL DEFAULT false,
                "userId"     integer,
                "token"      character varying                     NOT NULL,
                "tokenType"  "public"."user_tokens_tokentype_enum" NOT NULL,
                "expiresOn"  TIMESTAMP                             NOT NULL,
                "expired"    boolean                               NOT NULL DEFAULT false,
                CONSTRAINT "PK_63764db9d9aaa4af33e07b2f4bf" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "merchant"
            (
                "id"            SERIAL            NOT NULL,
                "identifier"    uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt"     TIMESTAMP         NOT NULL DEFAULT now(),
                "updatedAt"     TIMESTAMP         NOT NULL DEFAULT now(),
                "isActive"      boolean           NOT NULL DEFAULT true,
                "isDeleted"     boolean           NOT NULL DEFAULT false,
                "storeName"     character varying NOT NULL,
                "storeNameSlug" character varying NOT NULL,
                "phoneNumber"   character varying NOT NULL,
                "photoUrl"      character varying,
                "userId"        integer,
                CONSTRAINT "PK_9a3850e0537d869734fc9bff5d6" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "customer"
            (
                "id"          SERIAL            NOT NULL,
                "identifier"  uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                "updatedAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                "isActive"    boolean           NOT NULL DEFAULT true,
                "isDeleted"   boolean           NOT NULL DEFAULT false,
                "phoneNumber" character varying NOT NULL,
                "userId"      integer,
                CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."transaction_details_transactiontype_enum" AS ENUM('funding', 'deposit', 'withdrawal')
        `);
    await queryRunner.query(`
            CREATE TABLE "transaction_details"
            (
                "id"                     SERIAL                                              NOT NULL,
                "identifier"             uuid                                                NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt"              TIMESTAMP                                           NOT NULL DEFAULT now(),
                "updatedAt"              TIMESTAMP                                           NOT NULL DEFAULT now(),
                "isActive"               boolean                                             NOT NULL DEFAULT true,
                "isDeleted"              boolean                                             NOT NULL DEFAULT false,
                "walletId"               integer,
                "transactionType"        "public"."transaction_details_transactiontype_enum" NOT NULL,
                "amount"                 double precision                                    NOT NULL,
                "transactionDescription" character varying                                   NOT NULL,
                CONSTRAINT "PK_b9397af1203ca3a78ca6631e4b7" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "wallet"
            (
                "id"         SERIAL    NOT NULL,
                "identifier" uuid      NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt"  TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt"  TIMESTAMP NOT NULL DEFAULT now(),
                "isActive"   boolean   NOT NULL DEFAULT true,
                "isDeleted"  boolean   NOT NULL DEFAULT false,
                "userId"     integer   NOT NULL,
                "balance"    integer   NOT NULL,
                CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "internal_transaction"
            (
                "id"                     SERIAL            NOT NULL,
                "identifier"             uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt"              TIMESTAMP         NOT NULL DEFAULT now(),
                "updatedAt"              TIMESTAMP         NOT NULL DEFAULT now(),
                "isActive"               boolean           NOT NULL DEFAULT true,
                "isDeleted"              boolean           NOT NULL DEFAULT false,
                "amount"                 integer           NOT NULL,
                "sourceWalletId"         integer           NOT NULL,
                "destinationWalletId"    integer           NOT NULL,
                "transactionDescription" character varying NOT NULL,
                CONSTRAINT "PK_a260e6e5fee2f818eb8808f9964" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "purchase_order_item"
            (
                "id"               SERIAL    NOT NULL,
                "identifier"       uuid      NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt"        TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt"        TIMESTAMP NOT NULL DEFAULT now(),
                "isActive"         boolean   NOT NULL DEFAULT true,
                "isDeleted"        boolean   NOT NULL DEFAULT false,
                "orderId"          integer,
                "productVariantId" integer,
                "productId"        integer,
                "isProduct"        boolean   NOT NULL DEFAULT true,
                "quantity"         integer   NOT NULL,
                "cost"             double precision,
                CONSTRAINT "PK_f3eaf81afb216ae78a59cc19503" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."purchase_order_status_enum" AS ENUM('pending', 'processed', 'invalid')
        `);
    await queryRunner.query(`
            CREATE TABLE "purchase_order"
            (
                "id"         SERIAL                                NOT NULL,
                "identifier" uuid                                  NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt"  TIMESTAMP                             NOT NULL DEFAULT now(),
                "updatedAt"  TIMESTAMP                             NOT NULL DEFAULT now(),
                "isActive"   boolean                               NOT NULL DEFAULT true,
                "isDeleted"  boolean                               NOT NULL DEFAULT false,
                "customerId" integer                               NOT NULL,
                "cost"       double precision,
                "status"     "public"."purchase_order_status_enum" NOT NULL DEFAULT 'pending',
                CONSTRAINT "PK_ad3e1c7b862f4043b103a6c8c60" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."sales_order_status_enum" AS ENUM('pending', 'processed', 'invalid')
        `);
    await queryRunner.query(`
            CREATE TABLE "sales_order"
            (
                "id"               SERIAL                             NOT NULL,
                "identifier"       uuid                               NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt"        TIMESTAMP                          NOT NULL DEFAULT now(),
                "updatedAt"        TIMESTAMP                          NOT NULL DEFAULT now(),
                "isActive"         boolean                            NOT NULL DEFAULT true,
                "isDeleted"        boolean                            NOT NULL DEFAULT false,
                "customerId"       integer                            NOT NULL,
                "purchaseOrderId"  integer,
                "merchantId"       integer                            NOT NULL,
                "productVariantId" integer,
                "isProduct"        boolean                            NOT NULL DEFAULT true,
                "productId"        integer,
                "quantity"         integer                            NOT NULL DEFAULT '1',
                "cost"             double precision,
                "status"           "public"."sales_order_status_enum" NOT NULL DEFAULT 'pending',
                CONSTRAINT "PK_1631a193003bfc4297c61ba38ba" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "product_category"
            (
                "id"         SERIAL            NOT NULL,
                "identifier" uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt"  TIMESTAMP         NOT NULL DEFAULT now(),
                "updatedAt"  TIMESTAMP         NOT NULL DEFAULT now(),
                "isActive"   boolean           NOT NULL DEFAULT true,
                "isDeleted"  boolean           NOT NULL DEFAULT false,
                "name"       character varying NOT NULL,
                "nameSlug"   character varying NOT NULL,
                "photoUrl"   character varying,
                CONSTRAINT "PK_0dce9bc93c2d2c399982d04bef1" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "product"
            (
                "id"          SERIAL            NOT NULL,
                "identifier"  uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                "updatedAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                "isActive"    boolean           NOT NULL DEFAULT true,
                "isDeleted"   boolean           NOT NULL DEFAULT false,
                "name"        character varying NOT NULL,
                "nameSlug"    character varying NOT NULL,
                "description" character varying NOT NULL,
                "basePrice"   double precision  NOT NULL,
                "stock"       integer           NOT NULL DEFAULT '1',
                "merchantId"  integer           NOT NULL,
                CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")
            );
--             CREATE INDEX
        `);

    await queryRunner.query(`
            CREATE TABLE "product_variant"
            (
                "id"             SERIAL            NOT NULL,
                "identifier"     uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt"      TIMESTAMP         NOT NULL DEFAULT now(),
                "updatedAt"      TIMESTAMP         NOT NULL DEFAULT now(),
                "isActive"       boolean           NOT NULL DEFAULT true,
                "isDeleted"      boolean           NOT NULL DEFAULT false,
                "sku"            character varying NOT NULL,
                "price"          double precision  NOT NULL,
                "stock"          integer           NOT NULL DEFAULT '1',
                "photoUrl"       character varying,
                "productId"      integer,
                "parentVariants" text array        NOT NULL,
                CONSTRAINT "PK_1ab69c9935c61f7c70791ae0a9f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "cart_item"
            (
                "id"               SERIAL    NOT NULL,
                "identifier"       uuid      NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt"        TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt"        TIMESTAMP NOT NULL DEFAULT now(),
                "isActive"         boolean   NOT NULL DEFAULT true,
                "isDeleted"        boolean   NOT NULL DEFAULT false,
                "cartId"           integer,
                "productVariantId" integer,
                "productId"        integer,
                "isProduct"        boolean   NOT NULL DEFAULT true,
                "quantity"         integer   NOT NULL DEFAULT '1',
                CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "cart"
            (
                "id"         SERIAL    NOT NULL,
                "identifier" uuid      NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt"  TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt"  TIMESTAMP NOT NULL DEFAULT now(),
                "isActive"   boolean   NOT NULL DEFAULT true,
                "isDeleted"  boolean   NOT NULL DEFAULT false,
                "customerId" integer,
                CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "collection"
            (
                "id"         SERIAL            NOT NULL,
                "identifier" uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt"  TIMESTAMP         NOT NULL DEFAULT now(),
                "updatedAt"  TIMESTAMP         NOT NULL DEFAULT now(),
                "isActive"   boolean           NOT NULL DEFAULT true,
                "isDeleted"  boolean           NOT NULL DEFAULT false,
                "merchantId" integer           NOT NULL,
                "label"      character varying NOT NULL,
                "slug"       character varying,
                "imageUrl"   character varying,
                CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "product_variant_options"
            (
                "id"             SERIAL    NOT NULL,
                "identifier"     uuid      NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt"      TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt"      TIMESTAMP NOT NULL DEFAULT now(),
                "isActive"       boolean   NOT NULL DEFAULT true,
                "isDeleted"      boolean   NOT NULL DEFAULT false,
                "variantOptions" jsonb,
                "productId"      integer,
                CONSTRAINT "REL_df006f8f6c43394ed649f2a2d7" UNIQUE ("productId"),
                CONSTRAINT "PK_cd62d81fd4813d94bfd1ef7cda5" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "collection_items_product"
            (
                "collectionId" integer NOT NULL,
                "productId"    integer NOT NULL,
                CONSTRAINT "PK_4b4b47027d0baaf0a4a33851268" PRIMARY KEY ("collectionId", "productId")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_a3563a2fccedae8e289bc1e9d9" ON "collection_items_product" ("collectionId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_5c1b0e36f024166914d110c630" ON "collection_items_product" ("productId")
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction_details"
                ADD CONSTRAINT "FK_56e88d805bb9f716efef0ddec50" FOREIGN KEY ("walletId") REFERENCES "wallet" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "purchase_order_item"
                ADD CONSTRAINT "FK_6e4f18258dd35446b59f16d2f6e" FOREIGN KEY ("orderId") REFERENCES "purchase_order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "sales_order"
                ADD CONSTRAINT "FK_c6bd037c99c06e1dc7edd1080c9" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product_variant"
                ADD CONSTRAINT "FK_6e420052844edf3a5506d863ce6" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "cart_item"
                ADD CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "cart" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "cart_item"
                ADD CONSTRAINT "FK_47b024caf15725746fe69d1f487" FOREIGN KEY ("productVariantId") REFERENCES "product_variant" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "cart_item"
                ADD CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product_variant_options"
                ADD CONSTRAINT "FK_df006f8f6c43394ed649f2a2d73" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "collection_items_product"
                ADD CONSTRAINT "FK_a3563a2fccedae8e289bc1e9d92" FOREIGN KEY ("collectionId") REFERENCES "collection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "collection_items_product"
                ADD CONSTRAINT "FK_5c1b0e36f024166914d110c6307" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "collection_items_product"
                DROP CONSTRAINT "FK_5c1b0e36f024166914d110c6307"
        `);
    await queryRunner.query(`
            ALTER TABLE "collection_items_product"
                DROP CONSTRAINT "FK_a3563a2fccedae8e289bc1e9d92"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_variant_options"
                DROP CONSTRAINT "FK_df006f8f6c43394ed649f2a2d73"
        `);
    await queryRunner.query(`
            ALTER TABLE "cart_item"
                DROP CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf"
        `);
    await queryRunner.query(`
            ALTER TABLE "cart_item"
                DROP CONSTRAINT "FK_47b024caf15725746fe69d1f487"
        `);
    await queryRunner.query(`
            ALTER TABLE "cart_item"
                DROP CONSTRAINT "FK_29e590514f9941296f3a2440d39"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_variant"
                DROP CONSTRAINT "FK_6e420052844edf3a5506d863ce6"
        `);
    await queryRunner.query(`
            ALTER TABLE "sales_order"
                DROP CONSTRAINT "FK_c6bd037c99c06e1dc7edd1080c9"
        `);
    await queryRunner.query(`
            ALTER TABLE "purchase_order_item"
                DROP CONSTRAINT "FK_6e4f18258dd35446b59f16d2f6e"
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction_details"
                DROP CONSTRAINT "FK_56e88d805bb9f716efef0ddec50"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_5c1b0e36f024166914d110c630"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_a3563a2fccedae8e289bc1e9d9"
        `);
    await queryRunner.query(`
            DROP TABLE "collection_items_product"
        `);
    await queryRunner.query(`
            DROP TABLE "product_variant_options"
        `);
    await queryRunner.query(`
            DROP TABLE "collection"
        `);
    await queryRunner.query(`
            DROP TABLE "cart"
        `);
    await queryRunner.query(`
            DROP TABLE "cart_item"
        `);
    await queryRunner.query(`
            DROP TABLE "product_variant"
        `);
    await queryRunner.query(`
            DROP TABLE "product"
        `);
    await queryRunner.query(`
            DROP TABLE "product_category"
        `);
    await queryRunner.query(`
            DROP TABLE "sales_order"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."sales_order_status_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "purchase_order"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."purchase_order_status_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "purchase_order_item"
        `);
    await queryRunner.query(`
            DROP TABLE "internal_transaction"
        `);
    await queryRunner.query(`
            DROP TABLE "wallet"
        `);
    await queryRunner.query(`
            DROP TABLE "transaction_details"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."transaction_details_transactiontype_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "customer"
        `);
    await queryRunner.query(`
            DROP TABLE "merchant"
        `);
    await queryRunner.query(`
            DROP TABLE "user_tokens"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."user_tokens_tokentype_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "settings_user_roles"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
  }
}
