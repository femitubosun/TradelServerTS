import SettingsUserRoleService from "Logic/Services/SettingsUserRole/SettingsUserRoleService";
import { BadRequestError, InternalServerError } from "Exceptions/index";
import {
  CUSTOMER_ONBOARDING_SUCCESS,
  CUSTOMER_ROLE_NAME,
  EMAIL_IN_USE,
  ROLE_DOES_NOT_EXIST,
} from "Helpers/Messages/SystemMessages";
import UsersService from "Logic/Services/Users/UsersService";
import CustomersService from "Logic/Services/Customers/CustomersService";
import CartService from "Logic/Services/Cart/CartService";
import { CustomerOnboardingUseCaseArgs } from "Logic/UseCases/Onboarding/TypeChecking";
import { LoggingProviderFactory } from "Lib/Infra/Internal/Logging";
import { eventTypes } from "Lib/Events/Listeners/TypeChecking/eventTypes";
import Event from "Lib/Events";
import UserTokensService from "Logic/Services/UserTokens/UserTokensService";

export class OnboardCustomer {
  /**
   * This Use Case handles Customer Onboarding.
   *
   * The Customer Onboarding Process includes
   * - Creating User Record with Customer Role
   * - Create A Customer Record with the created User
   * - Create CustomerCart
   * - Emit User Signup Event
   */

  public static async execute(
    customerOnboardingArgs: CustomerOnboardingUseCaseArgs
  ): Promise<string> {
    const loggingProvider = LoggingProviderFactory.build();

    const { email, password, firstName, lastName, phoneNumber, queryRunner } =
      customerOnboardingArgs;

    const [foundUser, role] = await Promise.all([
      UsersService.getUserByEmail(email),
      SettingsUserRoleService.findSettingsUserRoleByName(CUSTOMER_ROLE_NAME),
    ]);

    if (foundUser) throw new BadRequestError(EMAIL_IN_USE);

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

      const token = await UserTokensService.createEmailActivationToken({
        userId: user.id,
        queryRunner,
      });

      await queryRunner.commitTransaction();

      Event.emit(eventTypes.user.signUp, {
        userEmail: user.email,
        activationToken: token.token,
      });

      return CUSTOMER_ONBOARDING_SUCCESS;
    } catch (typeOrmError: any) {
      loggingProvider.error(typeOrmError);
      await queryRunner.rollbackTransaction();
      throw new InternalServerError();
    }
  }
}
