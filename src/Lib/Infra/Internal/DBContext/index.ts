import { DataSource } from "typeorm";
import { AppDataSource } from "Lib/Infra/Internal/DBContext/DataSource";
import { SettingsUserRoles } from "Entities/SettingsUserRoles";
import { inject, singleton, container } from "tsyringe";

container.register("DataSource", { useValue: AppDataSource });

@singleton()
export class DBContext {
  private _dbSource: DataSource;

  constructor(@inject("DataSource") dbSource: DataSource) {
    this._dbSource = dbSource;
  }

  public async connect() {
    this._dbSource
      .initialize()
      .then(() => console.log("Database Initialized"))
      .catch((e) => console.error());
  }

  public async populateDB() {
    // TODO refactor to .env
    const roles = ["super_admin", "data_admin", "merchant", "customer"];

    for (let role of roles) {
      await this._createRoleIfNotExist(role);
    }
  }

  public getEntityRepository(entity: any) {
    return this._dbSource.getRepository(entity);
  }

  public async getTransactionalQueryRunner() {
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
