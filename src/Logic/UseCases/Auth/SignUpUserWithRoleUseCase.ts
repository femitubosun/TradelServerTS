import UsersService from "Logic/Services/Users/UsersService";
import SettingsUserRoleService from "Logic/Services/SettingsUserRole/SettingsUserRoleService";
import { BadRequestError } from "Logic/Exceptions";
import { EMAIL_IN_USE_ERROR, ROLE_DOES_NOT_EXIST } from "Utils/Messages";

export type SignUpUserWithRoleDTO = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleName: string;
};

export class SignUpUserWithRoleUseCase {
  public static async execute(
    signupUserWithRoleDTOType: SignUpUserWithRoleDTO
  ) {
    const { firstName, lastName, email, password, roleName } =
      signupUserWithRoleDTOType;

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

    const createUserRecordDTO = {
      firstName,
      lastName,
      email,
      password,
      role: userRole!,
    };

    await UsersService.createUserRecord(createUserRecordDTO);
    return;
  }
}
