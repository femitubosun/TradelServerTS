import { MigrationInterface, QueryRunner } from "typeorm";

export class ProfileMigrations1680901792744 implements MigrationInterface {
  name = "ProfileMigrations1680901792744";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "merchants"
            (
                "id"                    SERIAL            NOT NULL,
                "identifier"            uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "store_name"            character varying NOT NULL,
                "store_name_slug"       character varying NOT NULL,
                "phone_number"          character varying NOT NULL,
                "photo_url"             character varying,
                "document_with_weights" tsvector          NOT NULL,
                "user_id"               integer,
                "created_at"            TIMESTAMP         NOT NULL DEFAULT now(),
                "updated_at"            TIMESTAMP         NOT NULL DEFAULT now(),
                "is_active"             boolean           NOT NULL DEFAULT true,
                "is_deleted"            boolean           NOT NULL DEFAULT false,
                CONSTRAINT "PK_4fd312ef25f8e05ad47bfe7ed25" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "customers"
            (
                "id"           SERIAL            NOT NULL,
                "identifier"   uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "phone_number" character varying NOT NULL,
                "user_id"      integer,
                "created_at"   TIMESTAMP         NOT NULL DEFAULT now(),
                "updated_at"   TIMESTAMP         NOT NULL DEFAULT now(),
                "is_active"    boolean           NOT NULL DEFAULT true,
                "is_deleted"   boolean           NOT NULL DEFAULT false,

                CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`update merchants
                                 set document_with_weights = setweight(to_tsvector(store_name), 'A');

        CREATE INDEX merchant_document_weights_idx
            ON merchants
                USING GIN (document_with_weights);
        CREATE FUNCTION merchants_tsvector_trigger() RETURNS trigger AS
        $$
        begin
            new.document_with_weights :=
                    setweight(to_tsvector('english', coalesce(new.store_name, '')), 'A');
            return new;
        end
        $$ LANGUAGE plpgsql;
        CREATE TRIGGER tsvectorupdate
            BEFORE INSERT OR UPDATE
            ON merchants
            FOR EACH ROW
        EXECUTE PROCEDURE merchants_tsvector_trigger();
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "customers"
        `);
    await queryRunner.query(`
            DROP TABLE "merchants"
        `);
  }
}
