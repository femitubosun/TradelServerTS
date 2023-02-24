import {
  DataSource,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository,
} from "typeorm";
import { AppDataSource } from "Lib/Infra/Internal/DBContext/DataSource";
import { SettingsUserRoles } from "Entities/SettingsUserRoles";
import { inject, singleton, container } from "tsyringe";
import { NULL_OBJECT } from "Helpers/Messages/SystemMessages";
import { InternalServerError } from "Exceptions/InternalServerError";

container.register("DataSource", { useValue: AppDataSource });

@singleton()
export class DbContext {
  private _dbSource: DataSource;

  constructor(@inject("DataSource") dbSource: DataSource) {
    this._dbSource = dbSource;
  }

  public async connect() {
    await this._dbSource.initialize();
    await this.populateDB();
  }

  public async populateDB() {
    // TODO refactor to .env
    const roles = ["super_admin", "data_admin", "merchant", "customer"];

    for (const role of roles) {
      await this._createRoleIfNotExist(role);
    }
  }

  public getEntityRepository(
    entity: EntityTarget<ObjectLiteral>
  ): Repository<ObjectLiteral> {
    const entityRepository = this._dbSource.getRepository(entity);

    if (entityRepository === NULL_OBJECT)
      throw new InternalServerError("Entity Repository does not exist");

    return entityRepository;
  }

  public async getTransactionalQueryRunner(): Promise<QueryRunner> {
    const queryRunner = await this._dbSource.createQueryRunner();
    await queryRunner.connect();
    return queryRunner;
  }

  private async _createRoleIfNotExist(name: string) {
    const repo = this._dbSource.getRepository(SettingsUserRoles);
    try {
      await repo.findOneByOrFail({
        name,
      });
    } catch (err) {
      const role = new SettingsUserRoles();
      role.name = name;
      await repo.save(role);
    }
  }
}
