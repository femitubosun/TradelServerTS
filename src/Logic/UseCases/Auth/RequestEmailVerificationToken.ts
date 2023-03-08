// import UserTokensService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UserTokensService";
// import { UserTokenTypesEnum } from "TypeChecking/../../../Api/Modules/Client/OnboardingAndAuthentication/TypeChecking/UserTokens";
// import { RequestEmailVerificationTokenArgs } from "Logic/UseCases/Auth/TypeSetting/RequestEmailVerficationArgs";
// import { EmailService } from "Logic/Services/Email/EmailService";
// import UsersService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UsersService";
// import { BadRequestError } from "Api/Modules/Common/Exceptions/BadRequestError";
// import { generateStringOfLength } from "Utils/generateStringOfLength";
// import { businessConfig } from "Config/index";
// import {
//   SUCCESS,
//   USER_DOES_NOT_EXIST,
// } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
//
// export class RequestEmailVerificationToken {
//   public static async execute(
//     requestEmailVerificationTokenArgs: RequestEmailVerificationTokenArgs
//   ) {
//     const { userId, queryRunner } = requestEmailVerificationTokenArgs;
//     const user = await UsersService.getUserById(userId);
//
//     if (!user) throw new BadRequestError(USER_DOES_NOT_EXIST);
//
//     await queryRunner.rollbackTransaction();
//   }
// }
