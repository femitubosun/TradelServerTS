import UsersService from "Logic/Services/Users/UsersService";
import SettingsUserRoleService from "Logic/Services/SettingsUserRole/SettingsUserRoleService";
import { DBContext } from "Lib/Infra/Internal/DBContext";

export type SignupUserWithRoleOptions = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleName: string;
};

export class SignupUserWithRoleUseCase {
  public static async execute(
    dbContext: DBContext,
    signupCustomerUseCaseOptions: SignupUserWithRoleOptions
  ) {
    const { firstName, lastName, email, password, roleName } =
      signupCustomerUseCaseOptions;
    const userRole = await SettingsUserRoleService.findSettingsUserRoleByName(
      roleName
    );
    //TODO Add Exception
    if (!userRole) {
    }
    const createUserRecordOptions = {
      firstName,
      lastName,
      email,
      password,
      role: userRole!,
    };

    await UsersService.createUserRecord(createUserRecordOptions);
    return;
  }
}
