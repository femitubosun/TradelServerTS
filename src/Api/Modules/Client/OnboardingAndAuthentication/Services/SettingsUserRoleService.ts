import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { SettingsUserRoles } from "Api/Modules/Client/OnboardingAndAuthentication/Entities/SettingsUserRoles";
import { ISettingsUserRole } from "TypeChecking/../../Api/Modules/Client/OnboardingAndAuthentication/TypeChecking/SettingsUserRole";
import { Repository } from "typeorm";

@autoInjectable()
export class SettingsUserRoleService {
  private settingsUserRoleRepository;

  constructor(private dbContext?: DbContext) {
    this.settingsUserRoleRepository = dbContext?.getEntityRepository(
      SettingsUserRoles
    ) as Repository<SettingsUserRoles>;
  }

  public async getUserRoleById(id: number): Promise<ISettingsUserRole | null> {
    return await this.settingsUserRoleRepository.findOneBy({ id });
  }

  public async getUserRoleByIdentifier(
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

  public async createSettingsUserRoleRecord(
    name: string
  ): Promise<SettingsUserRoles> {
    const newRole = new SettingsUserRoles();
    newRole.name = name;
    return await this.settingsUserRoleRepository.save(newRole);
  }

  public getMerchantRoleName() {
    return "merchant";
  }
}

export default new SettingsUserRoleService();
