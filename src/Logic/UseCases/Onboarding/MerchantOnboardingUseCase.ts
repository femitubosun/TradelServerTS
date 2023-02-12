import { MerchantOnboardingUseCaseArgs } from "Logic/UseCases/Onboarding/TypeChecking";
import SettingsUserRoleService from "Logic/Services/SettingsUserRole/SettingsUserRoleService";
import CustomersService from "Logic/Services/Customers/CustomersService";
import { InternalServerError } from "Exceptions/InternalServerError";
import { EMAIL_IN_USE, ROLE_DOES_NOT_EXIST } from "Utils/Messages";
import UsersService from "Logic/Services/Users/UsersService";
import { BadRequestError } from "Exceptions/BadRequestError";
import { LoggingProviderFactory } from "Lib/Infra/Internal/Logging";

export class MerchantOnboardingUseCase {
  public static async execute(
    merchantOnboardingArgs: MerchantOnboardingUseCaseArgs
  ) {
    const loggingProvider = LoggingProviderFactory.build();
    const { email, firstName, lastName, password, phoneNumber, queryRunner } =
      merchantOnboardingArgs;

    const foundUser = await UsersService.getUserByEmail(email);

    if (foundUser) throw new BadRequestError(EMAIL_IN_USE);

    const merchantRole =
      await SettingsUserRoleService.findSettingsUserRoleByName("merchant");

    if (!merchantRole) throw new InternalServerError(ROLE_DOES_NOT_EXIST);

    await queryRunner.startTransaction();
    try {
      const user = await UsersService.createUserRecord({
        firstName,
        lastName,
        email,
        role: merchantRole,
        queryRunner,
        password,
      });

      //  TODO
    } catch (typeOrmError) {
      loggingProvider.error(typeOrmError);
      await queryRunner.rollbackTransaction();
      throw new InternalServerError();
    }
  }
}
