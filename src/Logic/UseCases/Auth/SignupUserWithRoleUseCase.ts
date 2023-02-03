import UsersService from "Logic/Services/Users/UsersService";
import SettingsUserRoleService from "Logic/Services/SettingsUserRole/SettingsUserRoleService";
import { DBContext } from "Lib/Infra/Internal/DBContext";
import { BadRequestError } from "Logic/Exceptions";
import { EMAIL_IN_USE_ERROR, ROLE_DOES_NOT_EXIST } from "Utils/Messages";

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

    const user = await UsersService.findUserByEmail(email);

    if (user) {
      throw new BadRequestError(EMAIL_IN_USE_ERROR);
    }
    const userRole = await SettingsUserRoleService.findSettingsUserRoleByName(
      roleName
    );
    if (!userRole) {
      throw new BadRequestError(ROLE_DOES_NOT_EXIST);
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
