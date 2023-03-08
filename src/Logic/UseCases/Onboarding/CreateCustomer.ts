import SettingsUserRoleService from "Logic/Services/SettingsUserRoleService";
import { BadRequestError, InternalServerError } from "Exceptions/index";
import {
  CUSTOMER_ROLE_NAME,
  EMAIL_IN_USE,
  NULL_OBJECT,
  ROLE_DOES_NOT_EXIST,
  SOMETHING_WENT_WRONG,
} from "Helpers/Messages/SystemMessages";
import UsersService from "Logic/Services/UsersService";
import CustomersService from "Logic/Services/CustomersService";
import CartService from "Logic/Services/CartService";
import { CreateCustomerUseCaseDtoType } from "Logic/UseCases/Onboarding/TypeChecking";
import { eventTypes } from "Lib/Events/Listeners/TypeChecking/eventTypes";
import Event from "Lib/Events";
import UserTokensService from "Logic/Services/UserTokensService";
import { generateStringOfLength } from "Utils/generateStringOfLength";
import { businessConfig } from "Config/businessConfig";
import { JwtHelper } from "Helpers/JwtHelper";

export class CreateCustomer {
  /**
   * @description This Use Case v Customer Onboarding.
   * @memberOf CreateCustomer
   * @param {CreateCustomerUseCaseDtoType} createCustomerDto
   */
  public static async execute(createCustomerDto: CreateCustomerUseCaseDtoType) {
    const { email, password, firstName, lastName, phoneNumber, queryRunner } =
      createCustomerDto;

    const [foundUser, role] = await Promise.all([
      UsersService.getUserByEmail(email),
      SettingsUserRoleService.findSettingsUserRoleByName(CUSTOMER_ROLE_NAME),
    ]);

    if (foundUser) throw new BadRequestError(EMAIL_IN_USE);

    if (role === NULL_OBJECT) {
      throw new InternalServerError(ROLE_DOES_NOT_EXIST);
    }

    await queryRunner.startTransaction();

    try {
      const user = await UsersService.createUserRecord({
        firstName,
        lastName,
        email,
        password,
        roleId: role.id,
        queryRunner,
      });

      const customer = await CustomersService.createCustomerRecord({
        userId: user.id,
        phoneNumber,
        queryRunner,
      });

      await CartService.createCartRecord({
        customerId: customer,
        queryRunner,
      });
      const token = generateStringOfLength(businessConfig.emailTokenLength);

      const otpToken = await UserTokensService.createEmailActivationToken({
        userId: user.id,
        queryRunner,
        token,
      });

      await queryRunner.commitTransaction();

      const accessToken = JwtHelper.signUser(user);

      Event.emit(eventTypes.user.signUp, {
        userEmail: user.email,
        activationToken: otpToken.token,
      });

      return {
        user: {
          identifier: user.identifier,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
        },
        access_token: accessToken,
      };
    } catch (typeOrmError) {
      console.log(typeOrmError);
      await queryRunner.rollbackTransaction();
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }
}
