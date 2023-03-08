// import { EmailVerificationArgs } from "Logic/UseCases/Onboarding/";
// import UserTokensService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UserTokensService";
// import userTokensService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UserTokensService";
// import usersService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UsersService";
// import { BadRequestError } from "Api/Modules/Common/Exceptions/BadRequestError";
// import {
//   EMAIL_VERIFICATION_SUCCESS,
//   INVALID_TOKEN_TYPE,
//   NO_TOKEN_RECORD,
//   SOMETHING_WENT_WRONG,
//   TOKEN_EXPIRED,
//   UNAUTHORIZED_OPERATION,
//   USER_DOES_NOT_EXIST,
// } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
// import { UnauthorizedError } from "Api/Modules/Common/Exceptions/UnauthorizedError";
// import { DateTime } from "luxon";
// import { InternalServerError } from "Api/Modules/Common/Exceptions/InternalServerError";
// import UsersService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UsersService";
// import { UserTokenTypesEnum } from "TypeChecking/../../../Api/Modules/Client/OnboardingAndAuthentication/TypeChecking/UserTokens";
//
// export class VerifyUserEmail {
//   /**
//    * This Use Case handles Email Verification
//    *
//    * The Email verification process includes
//    *
//    *     - Query the token by token_value
//    *     - Check if the token's user is the same as the Current User
//    *     - Check if the token as expired.
//    *     - Confirm if the token is an email Verification Token
//    *     - Verify User
//    */
//
//   public static async execute(emailVerificationArgs: EmailVerificationArgs) {
//     const { emailVerificationToken, user } = emailVerificationArgs;
//
//     return EMAIL_VERIFICATION_SUCCESS;
//   }
// }
