// import { ResetPasswordArgs } from "Logic/UseCases/Auth/TypeSetting/ResetPasswordArgs";
// import UserTokensService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UserTokensService";
// import { BadRequestError } from "Api/Modules/Common/Exceptions/BadRequestError";
// import {
//   INVALID_TOKEN,
//   INVALID_TOKEN_TYPE,
//   SUCCESS,
//   TOKEN_EXPIRED,
//   USER_DOES_NOT_EXIST,
// } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
// import { UserTokenTypesEnum } from "TypeChecking/../../../Api/Modules/Client/OnboardingAndAuthentication/TypeChecking/UserTokens";
// import UsersService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UsersService";
// import { ChangePasswordDto } from "TypeChecking/../../../Api/Modules/Client/OnboardingAndAuthentication/TypeChecking/Users/ChangePasswordDto";
// import { DateTime } from "luxon";
// import { PasswordEncryptionHelper } from "Api/Modules/Common/Helpers/PasswordEncryptionHelper";
//
// export class ResetPassword {
//   public static async execute(resetPasswordArgs: ResetPasswordArgs) {
//     const { password, passwordResetToken, queryRunner } = resetPasswordArgs;
//
//     const token = await UserTokensService.getUserTokenByToken(
//       passwordResetToken
//     );
//     if (!token) throw new BadRequestError(INVALID_TOKEN);
//
//     if (token.tokenType != UserTokenTypesEnum.PASSWORD_RESET)
//       throw new BadRequestError(INVALID_TOKEN_TYPE);
//
//     if (token.expired || DateTime.now() > token.expiresOn)
//       throw new BadRequestError(TOKEN_EXPIRED);
//
//     const user = await UsersService.getUserById(token.userId);
//
//     if (!user) throw new BadRequestError(USER_DOES_NOT_EXIST);
//
//     await queryRunner.startTransaction();
//
//     const changePasswordArgs: ChangePasswordDto = {
//       identifier: user.id,
//       identifierType: "id",
//       password: PasswordEncryptionHelper.hashPassword(password),
//       queryRunner,
//     };
//
//     await UsersService.changeUserPassword(changePasswordArgs);
//
//     await UserTokensService.deactivateUserToken(token.id);
//
//     await queryRunner.commitTransaction();
//   }
// }
