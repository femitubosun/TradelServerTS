import { MigrationInterface, QueryRunner } from "typeorm";

export class SetupMerchantFullTextIndex1680899792032
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
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

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
