// import {
//   JwtHelper,
//   PasswordEncryptionHelper,
// } from "Api/Modules/Common/Helpers/index";
// import UsersService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UsersService";
// import { SignInUserArgs } from "Logic/UseCases/Auth/TypeSetting";
// import { BadRequestError } from "Api/Modules/Common/Exceptions/index";
// import { CHECK_EMAIL_AND_PASSWORD } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
// import { SignInUserWithEmailReturnType } from "Logic/UseCases/Auth/TypeSetting/TokenPayloadType";
// import Event from "Lib/Events";
// import { eventTypes } from "Lib/Events/Listeners/TypeChecking/eventTypes";
//
// export class SignInUserWithEmail {
//   public static async execute(
//     signInUserDTO: SignInUserArgs
//   ): Promise<SignInUserWithEmailReturnType> {
//     const { email, password } = signInUserDTO;
//
//     const user = await UsersService.getUserByEmail(email);
//
//     if (!user) throw new BadRequestError(CHECK_EMAIL_AND_PASSWORD);
//
//     const isMatch = await PasswordEncryptionHelper.verifyPassword(
//       password,
//       user.password
//     );
//
//     if (!isMatch) throw new BadRequestError(CHECK_EMAIL_AND_PASSWORD);
//
//     const token = JwtHelper.signUser(user);
//
//     Event.emit(eventTypes.user.signIn, user.id);
//
//     if (user.isFirstTimeLogin) {
//       await UsersService.updateUserRecord({
//         identifier: user.id,
//         identifierType: "id",
//         updateUserRecordPayload: {
//           isFirstTimeLogin: false,
//         },
//       });
//     }
//
//     return {
//       user: {
//         identifier: user.identifier,
//         email: user.email,
//       },
//       token,
//     };
//   }
// }
