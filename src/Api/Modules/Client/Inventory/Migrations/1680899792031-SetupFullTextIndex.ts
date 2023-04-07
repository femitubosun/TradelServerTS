import { MigrationInterface, QueryRunner } from "typeorm";

export class SetupFullTextIndex1680899792031 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`update products
                                 set document_with_weights = setweight(to_tsvector(name), 'A') ||
                                                             setweight(to_tsvector(coalesce(description, '')), 'B');

        CREATE INDEX document_weights_idx
            ON products
                USING GIN (document_with_weights);
        CREATE FUNCTION products_tsvector_trigger() RETURNS trigger AS
        $$
        begin
            new.document_with_weights :=
                        setweight(to_tsvector('english', coalesce(new.name, '')), 'A')
                        || setweight(to_tsvector('english', coalesce(new.description, '')), 'B');
            return new;
        end
        $$ LANGUAGE plpgsql;
        CREATE TRIGGER tsvectorupdate
            BEFORE INSERT OR UPDATE
            ON products
            FOR EACH ROW
        EXECUTE PROCEDURE products_tsvector_trigger();
        `);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
