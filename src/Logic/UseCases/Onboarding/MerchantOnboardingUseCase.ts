import { MerchantOnboardingUseCaseArgs } from "Logic/UseCases/Onboarding/TypeChecking";
import SettingsUserRoleService from "Logic/Services/SettingsUserRole/SettingsUserRoleService";
import MerchantService from "Logic/Services/Merchant/MerchantService";
import { InternalServerError } from "Exceptions/InternalServerError";
import {
  EMAIL_IN_USE,
  ROLE_DOES_NOT_EXIST,
} from "Helpers/Messages/SystemMessages";
import UsersService from "Logic/Services/Users/UsersService";
import { BadRequestError } from "Exceptions/BadRequestError";
import { LoggingProviderFactory } from "Lib/Infra/Internal/Logging";
import UserTokensService from "Logic/Services/UserTokens/UserTokensService";
import { EmailProviderFactory, SendEmailArgs } from "Lib/Infra/External/Email";

export class MerchantOnboardingUseCase {
  public static async execute(
    merchantOnboardingArgs: MerchantOnboardingUseCaseArgs
  ) {
    const loggingProvider = LoggingProviderFactory.build();
    const {
      email,
      firstName,
      lastName,
      password,
      phoneNumber,
      storeName,
      queryRunner,
    } = merchantOnboardingArgs;

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

      // TODO Add Store Name to request Args
      const merchant = await MerchantService.createMerchantRecord({
        user,
        phoneNumber,
        storeName,
        queryRunner,
      });

      const userToken = await UserTokensService.createEmailActivationToken(
        user
      );

      await queryRunner.commitTransaction();

      const emailPayload: SendEmailArgs = {
        body: userToken.token,
        subject: "Tradel Merchant Account Activation Email",
        to: email,
      };
      const emailProvider = EmailProviderFactory.build();
      await emailProvider.sendEmail(emailPayload);
    } catch (typeOrmError) {
      loggingProvider.error(typeOrmError);
      await queryRunner.rollbackTransaction();
      throw new InternalServerError();
    }
  }
}
