import { autoInjectable } from "tsyringe";
import { DBContext } from "Lib/Infra/Internal/DBContext";
import { SettingsUserRoles } from "Domain/Entities/SettingsUserRoles";
import { ISettingsUserRole } from "Logic/Services/SettingsUserRole/Options";

@autoInjectable()
class SettingsUserRoleService {
  private settingsRepo: any;

  constructor(private dbContext?: DBContext) {
    this.settingsRepo = dbContext?.getEntityRepository(SettingsUserRoles);
  }

  public async findSettingsUserRoleById(
    id: number
  ): Promise<ISettingsUserRole | null> {
    return await this.settingsRepo.findOneBy({ id });
  }

  public async findSettingsUserRoleByIdentifier(
    identifier: string
  ): Promise<ISettingsUserRole | null> {
    return await this.settingsRepo.findOneBy({
      identifier,
    });
  }

  public async findSettingsUserRoleByName(
    name: string
  ): Promise<ISettingsUserRole | null> {
    return await this.settingsRepo.findOneBy({
      name,
    });
  }

  public async createSettingsUserRoleRecord(name: string): Promise<boolean> {
    const newRole = new SettingsUserRoles();
    newRole.name = name;
    return await this.settingsRepo.save(newRole);
  }
}

export default new SettingsUserRoleService();
