import SettingsUserRoleService from "Logic/Services/SettingsUserRole/SettingsUserRoleService";
import { BadRequestError, InternalServerError } from "Logic/Exceptions";
import {
  ROLE_DOES_NOT_EXIST,
  CUSTOMER_ONBOARDING_SUCCESS,
} from "Utils/Messages";
import UsersService from "Logic/Services/Users/UsersService";
import CustomersService from "Logic/Services/Customers/CustomersService";
import { CustomerOnboardingArgs } from "Logic/UseCases/Onboarding/TypeChecking";

export class CustomerOnboardingUseCase {
  private static EMAIL_IN_USE: string;

  /**
   * This Use Case handles Customer Onboarding.
   *
   * The Customer Onboarding Process includes
   * - Creating User Record with Customer Role
   * - Create A Customer Record with the created User
   * - Create Email Activation Token & Send to User Email
   *
   */

  public static async execute(
    customerOnboardingArgs: CustomerOnboardingArgs
  ): Promise<string> {
    const { email, password, firstName, lastName, phoneNumber, queryRunner } =
      customerOnboardingArgs;

    const role = await SettingsUserRoleService.findSettingsUserRoleByName(
      "customer"
    );

    const user = await UsersService.findUserByEmail(email);
    if (user) {
      throw new BadRequestError(this.EMAIL_IN_USE);
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
        queryRunner,
      });
      await queryRunner.commitTransaction();
    } catch (typeOrmError) {
      console.error();
      console.error(typeOrmError);
      await queryRunner.rollbackTransaction();
      throw new InternalServerError();
    }
    // Create Activation Token And Send to User
    return CUSTOMER_ONBOARDING_SUCCESS;
  }
}
