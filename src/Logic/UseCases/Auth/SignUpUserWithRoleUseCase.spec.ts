import "reflect-metadata";
import {
  SignUpUserWithRoleDTO,
  SignUpUserWithRoleUseCase,
} from "Logic/UseCases/Auth/SignUpUserWithRoleUseCase";
import UsersService from "Logic/Services/Users/UsersService";
import SettingsUserRoleService from "Logic/Services/SettingsUserRole/SettingsUserRoleService";
import { ISettingsUserRole } from "Logic/Services/SettingsUserRole/Options";
import { BadRequestError, ValidationError } from "Logic/Exceptions";

describe("Sign Up User With Role UseCase", function () {
  const useCase = SignUpUserWithRoleUseCase;
  const signUpUserUseCaseDTO: SignUpUserWithRoleDTO = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    roleName: "",
  };

  const settingsUserRole: ISettingsUserRole = {
    createdAt: new Date(),
    id: 0,
    identifier: "",
    isActive: false,
    isDeleted: false,
    name: "",
    updatedAt: new Date(),
  };
  const findUserByEmailMock = jest.spyOn(UsersService, "findUserByEmail");
  findUserByEmailMock.mockImplementation(async (email: string) => {
    return;
  });
  const createUserMock = jest.spyOn(UsersService, "createUserRecord");

  createUserMock.mockReturnValue(Promise.resolve());

  const findRoleByNameMock = jest.spyOn(
    SettingsUserRoleService,
    "findSettingsUserRoleByName"
  );
  findRoleByNameMock.mockReturnValue(Promise.resolve(settingsUserRole));

  it("Should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("Should have an execute method", () => {
    expect(useCase.execute).toBeDefined();
  });

  it("Should call UsersService.findUserByEmail on execute()", async function () {
    await useCase.execute(signUpUserUseCaseDTO);
    expect(findUserByEmailMock).toHaveBeenCalledWith(
      signUpUserUseCaseDTO.email
    );
  });
  it("Should call SettingsUserRoleService.findSettingsUserRoleByName on execute()", async function () {
    await useCase.execute(signUpUserUseCaseDTO);
    expect(findRoleByNameMock).toHaveBeenCalledWith(
      signUpUserUseCaseDTO.roleName
    );
  });

  it("Should call UsersService.createUserRecord on execute", async function () {
    await useCase.execute(signUpUserUseCaseDTO);
    expect(createUserMock).toHaveBeenCalled();
  });

  it("Should throw BadRequest Error if UsersService.findUserByEmail returns a user ", async function () {
    findUserByEmailMock.mockReturnValue(Promise.resolve("user"));
    await expect(useCase.execute(signUpUserUseCaseDTO)).rejects.toBeInstanceOf(
      BadRequestError
    );
  });

  it("Should throw BadRequest Error is SettingsUserRole.findSettingsUserRoleByName does not return a user", async function () {});
});
