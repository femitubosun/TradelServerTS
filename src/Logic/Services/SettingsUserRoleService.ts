import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { SettingsUserRoles } from "Entities/SettingsUserRoles";
import { ISettingsUserRole } from "TypeChecking/SettingsUserRole";

@autoInjectable()
export class SettingsUserRoleService {
  private settingsUserRoleRepository: any;

  constructor(private dbContext?: DbContext) {
    this.settingsUserRoleRepository =
      dbContext?.getEntityRepository(SettingsUserRoles);
  }

  public async findSettingsUserRoleById(
    id: number
  ): Promise<ISettingsUserRole | null> {
    return await this.settingsUserRoleRepository.findOneBy({ id });
  }

  public async findSettingsUserRoleByIdentifier(
    identifier: string
  ): Promise<ISettingsUserRole | null> {
    return await this.settingsUserRoleRepository.findOneBy({
      identifier,
    });
  }

  public async findSettingsUserRoleByName(
    name: string
  ): Promise<ISettingsUserRole | null> {
    return await this.settingsUserRoleRepository.findOneBy({
      name,
    });
  }

  public async createSettingsUserRoleRecord(name: string): Promise<boolean> {
    const newRole = new SettingsUserRoles();
    newRole.name = name;
    return await this.settingsUserRoleRepository.save(newRole);
  }
}

export default new SettingsUserRoleService();
