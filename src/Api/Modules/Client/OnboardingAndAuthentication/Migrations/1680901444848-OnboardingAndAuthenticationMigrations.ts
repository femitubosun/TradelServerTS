import { MigrationInterface, QueryRunner } from "typeorm";

export class OnboardingAndAuthenticationMigrations1680901444848
  implements MigrationInterface
{
  name = "OnboardingAndAuthenticationMigrations1680901444848";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users"
            (
                "id"                  SERIAL            NOT NULL,
                "identifier"          uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "first_name"          character varying NOT NULL,
                "last_name"           character varying NOT NULL,
                "email"               character varying NOT NULL,
                "password"            character varying NOT NULL,
                "is_first_time_login" boolean           NOT NULL DEFAULT true,
                "has_verified_email"  boolean           NOT NULL DEFAULT false,
                "last_login_date"     TIMESTAMP,
                "role_id"             integer           NOT NULL,
                "created_at"          TIMESTAMP         NOT NULL DEFAULT now(),
                "updated_at"          TIMESTAMP         NOT NULL DEFAULT now(),
                "is_active"           boolean           NOT NULL DEFAULT true,
                "is_deleted"          boolean           NOT NULL DEFAULT false,
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "settings_user_roles"
            (
                "id"         SERIAL            NOT NULL,
                "identifier" uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "name"       character varying NOT NULL,
                "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP         NOT NULL DEFAULT now(),
                "is_active"  boolean           NOT NULL DEFAULT true,
                "is_deleted" boolean           NOT NULL DEFAULT false,
                CONSTRAINT "PK_4bbd21d348745391ad1702a6a59" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."user_tokens_token_type_enum" AS ENUM('access', 'refresh', 'email', 'passwordReset')
        `);
    await queryRunner.query(`
            CREATE TABLE "user_tokens"
            (
                "id"         SERIAL                                 NOT NULL,
                "identifier" uuid                                   NOT NULL DEFAULT uuid_generate_v4(),
                "user_id"    integer,
                "token"      character varying                      NOT NULL,
                "token_type" "public"."user_tokens_token_type_enum" NOT NULL,
                "expires_on" TIMESTAMP                              NOT NULL,
                "expired"    boolean                                NOT NULL DEFAULT false,
                "created_at" TIMESTAMP                              NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP                              NOT NULL DEFAULT now(),
                "is_active"  boolean                                NOT NULL DEFAULT true,
                "is_deleted" boolean                                NOT NULL DEFAULT false,
                CONSTRAINT "PK_63764db9d9aaa4af33e07b2f4bf" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "user_tokens"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."user_tokens_token_type_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "settings_user_roles"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
  }
}
