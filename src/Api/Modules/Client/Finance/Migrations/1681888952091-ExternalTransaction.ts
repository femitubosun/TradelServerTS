import { MigrationInterface, QueryRunner } from "typeorm";

export class ExternalTransaction1681888952091 implements MigrationInterface {
  name = "ExternalTransaction1681888952091";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."external_transactions_channel_enum" AS ENUM('paystack', 'flutterwave')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."external_transactions_transaction_type_enum" AS ENUM('fund', 'withdraw')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."external_transactions_transaction_status_enum" AS ENUM('pay_pending', 'pay_success', 'pay_failed')
        `);
    await queryRunner.query(`
            CREATE TABLE "external_transactions"
            (
                "id"                      SERIAL                                                   NOT NULL,
                "identifier"              uuid                                                     NOT NULL DEFAULT uuid_generate_v4(),
                "amount"                  integer                                                  NOT NULL,
                "channel"                 "public"."external_transactions_channel_enum"            NOT NULL,
                "destination_wallet_id"   integer                                                  NOT NULL,
                "transaction_description" character varying                                        NOT NULL,
                "transaction_reference"   character varying                                        NOT NULL,
                "transaction_type"        "public"."external_transactions_transaction_type_enum"   NOT NULL DEFAULT 'fund',
                "transaction_status"      "public"."external_transactions_transaction_status_enum" NOT NULL DEFAULT 'pay_pending',
                "created_at"              TIMESTAMP                                                NOT NULL DEFAULT now(),
                "updated_at"              TIMESTAMP                                                NOT NULL DEFAULT now(),
                "is_active"               boolean                                                  NOT NULL DEFAULT true,
                "is_deleted"              boolean                                                  NOT NULL DEFAULT false,
                CONSTRAINT "PK_247f1f7372e938562959bef7718" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "external_transactions"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."external_transactions_transaction_status_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."external_transactions_transaction_type_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."external_transactions_channel_enum"
        `);
  }
}
