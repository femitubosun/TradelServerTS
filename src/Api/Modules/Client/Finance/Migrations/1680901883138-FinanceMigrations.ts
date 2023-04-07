import { MigrationInterface, QueryRunner } from "typeorm";

export class FinanceMigrations1680901883138 implements MigrationInterface {
  name = "FinanceMigrations1680901883138";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."transaction_details_transaction_type_enum" AS ENUM('funding', 'deposit', 'withdrawal')
        `);
    await queryRunner.query(`
            CREATE TABLE "transaction_details"
            (
                "id"                      SERIAL                                               NOT NULL,
                "identifier"              uuid                                                 NOT NULL DEFAULT uuid_generate_v4(),
                "amount"                  double precision                                     NOT NULL,
                "transaction_description" character varying                                    NOT NULL,
                "transaction_type"        "public"."transaction_details_transaction_type_enum" NOT NULL,
                "wallet_id"               integer,
                "created_at"              TIMESTAMP                                            NOT NULL DEFAULT now(),
                "updated_at"              TIMESTAMP                                            NOT NULL DEFAULT now(),
                "is_active"               boolean                                              NOT NULL DEFAULT true,
                "is_deleted"              boolean                                              NOT NULL DEFAULT false,
                CONSTRAINT "PK_b9397af1203ca3a78ca6631e4b7" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "wallets"
            (
                "id"         SERIAL    NOT NULL,
                "identifier" uuid      NOT NULL DEFAULT uuid_generate_v4(),
                "balance"    integer   NOT NULL,
                "user_id"    integer   NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "is_active"  boolean   NOT NULL DEFAULT true,
                "is_deleted" boolean   NOT NULL DEFAULT false,

                CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "internal_transaction"
            (
                "id"                      SERIAL            NOT NULL,
                "identifier"              uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "amount"                  integer           NOT NULL,
                "source_wallet_id"        integer           NOT NULL,
                "destination_wallet_id"   integer           NOT NULL,
                "transaction_description" character varying NOT NULL,
                "created_at"              TIMESTAMP         NOT NULL DEFAULT now(),
                "updated_at"              TIMESTAMP         NOT NULL DEFAULT now(),
                "is_active"               boolean           NOT NULL DEFAULT true,
                "is_deleted"              boolean           NOT NULL DEFAULT false,
                CONSTRAINT "PK_a260e6e5fee2f818eb8808f9964" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction_details"
                ADD CONSTRAINT "FK_116bab1d3f4dc066604dce41f80" FOREIGN KEY ("wallet_id") REFERENCES "wallets" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "transaction_details"
                DROP CONSTRAINT "FK_116bab1d3f4dc066604dce41f80"
        `);
    await queryRunner.query(`
            DROP TABLE "internal_transaction"
        `);
    await queryRunner.query(`
            DROP TABLE "wallets"
        `);
    await queryRunner.query(`
            DROP TABLE "transaction_details"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."transaction_details_transaction_type_enum"
        `);
  }
}
