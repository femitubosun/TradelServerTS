import { SettingsUserRoleService } from "Logic/Services/SettingsUserRole/SettingsUserRoleService";
import { DBContext } from "Lib/Infra/Internal/DBContext";
import { TestDataSource } from "Lib/Infra/Internal/DBContext/DataSource";

describe("SettingsUserRoleService test", () => {
  const dbContext = new DBContext(TestDataSource);

  const service = new SettingsUserRoleService(dbContext);
  it("Should be defined", async () => {
    await dbContext.connect();
    await dbContext.populateDB();
    expect(service).toBeDefined();
  });

  it("Should have a settingsUserRoleRepository property", () => {
    expect(service).toHaveProperty("settingsUserRoleRepository");
  });
  it("Should have a findSettingsUserRoleById method", () => {
    expect(service).toHaveProperty("findSettingsUserRoleById");
  });

  it("Should call return a role or null when findSettingsUserRole is called ", async () => {
    const role = await service.findSettingsUserRoleById(1);
    expect(role).toEqual(null);
  });
});
