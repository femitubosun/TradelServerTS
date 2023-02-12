import SettingsUserRoleService from "Logic/Services/SettingsUserRole/SettingsUserRoleService";
import { BadRequestError, InternalServerError } from "Exceptions/index";
import {
  CUSTOMER_ONBOARDING_SUCCESS,
  ROLE_DOES_NOT_EXIST,
} from "Utils/Messages";
import UsersService from "Logic/Services/Users/UsersService";
import CustomersService from "Logic/Services/Customers/CustomersService";
import UserTokensService from "Logic/Services/UserTokens/UserTokensService";
import CartService from "Logic/Services/Cart/CartService";
import { CustomerOnboardingUseCaseArgs } from "Logic/UseCases/Onboarding/TypeChecking";
import { EMAIL_IN_USE } from "Utils/Messages";
import { EmailProviderFactory, SendEmailArgs } from "Lib/Infra/External/Email";
import { LoggingProviderFactory } from "Lib/Infra/Internal/Logging";

export class CustomerOnboardingUseCase {
  /**
   * This Use Case handles Customer Onboarding.
   *
   * The Customer Onboarding Process includes
   * - Creating User Record with Customer Role
   * - Create A Customer Record with the created User
   * - Create CustomerCart
   * - Create Email Activation Token & Send to User Email
   *
   */

  public static async execute(
    customerOnboardingArgs: CustomerOnboardingUseCaseArgs
  ): Promise<string> {
    const loggingProvider = LoggingProviderFactory.build();

    const { email, password, firstName, lastName, phoneNumber, queryRunner } =
      customerOnboardingArgs;

    const role = await SettingsUserRoleService.findSettingsUserRoleByName(
      "customer"
    );

    const foundUser = await UsersService.getUserByEmail(email);
    if (foundUser) {
      throw new BadRequestError(EMAIL_IN_USE);
    }
    if (!role) {
      throw new InternalServerError(ROLE_DOES_NOT_EXIST);
    }
    await queryRunner.startTransaction();
    try {
      const user = await UsersService.createUserRecord({
        firstName,
        lastName,
        email,
        password,
        role,
        queryRunner,
      });

      const customer = await CustomersService.createCustomerRecord({
        user,
        phoneNumber,
        queryRunner,
      });

      await CartService.createCartRecord({
        customer,
        queryRunner,
      });
      const userToken = await UserTokensService.createEmailActivationToken(
        user
      );

      await queryRunner.commitTransaction();

      const emailPayload: SendEmailArgs = {
        body: userToken.token,
        subject: "Tradel Activation Email",
        to: email,
      };
      const emailProvider = EmailProviderFactory.build();
      await emailProvider.sendEmail(emailPayload);

      return CUSTOMER_ONBOARDING_SUCCESS;
    } catch (typeOrmError: any) {
      loggingProvider.error(typeOrmError);
      await queryRunner.rollbackTransaction();
      throw new InternalServerError();
    }
  }
}
