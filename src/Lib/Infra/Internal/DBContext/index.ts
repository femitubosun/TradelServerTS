import { BaseEntity, DataSource, EntityTarget } from "typeorm";
import { AppDataSource } from "Lib/Infra/Internal/DBContext/DataSource";
import { SettingsUserRoles } from "Domain/Entities/SettingsUserRoles";
import { singleton } from "tsyringe";

@singleton()
export class DBContext {
  private _dbSource: DataSource;

  constructor() {
    this._dbSource = AppDataSource;
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
      console.log("Carry on", name);
    }
  }
}
