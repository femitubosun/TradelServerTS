import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  NULL_OBJECT,
  PASSWORD_RESET_LINK_GENERATED,
  SOMETHING_WENT_WRONG,
  SUCCESS,
  USER_RESOURCE,
} from "Helpers/Messages/SystemMessages";
import UsersService from "Logic/Services/UsersService";
import { RECORD_NOT_FOUND } from "Helpers/Messages/SystemMessageFunctions";
import UserTokensService from "Logic/Services/UserTokensService";
import { UserTokenTypesEnum } from "TypeChecking/UserTokens";
import { generateStringOfLength } from "Utils/generateStringOfLength";
import { businessConfig } from "Config/businessConfig";
import { expressConfig } from "Config/expressConfig";
import { SendPasswordResetLinkDtoType } from "Logic/Services/Email/TypeChecking/SendPasswordRestLinkDtoType";
import { EmailService } from "Logic/Services/Email/EmailService";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";

const dbContext = container.resolve(DbContext);

class RequestPasswordResetLinkController {
  public async handle(request: Request, response: Response) {
    try {
      const { email } = request.body;

      const queryRunner = await dbContext.getTransactionalQueryRunner();

      await queryRunner.startTransaction();

      try {
        const user = await UsersService.getUserByEmail(email);

        if (user == NULL_OBJECT) {
          return response.status(HttpStatusCodeEnum.BAD_REQUEST).json({
            status_code: HttpStatusCodeEnum.BAD_REQUEST,
            status: ERROR,
            message: RECORD_NOT_FOUND(USER_RESOURCE),
          });
        }

        const userToken = await UserTokensService.fetchActiveUserTokenRecord({
          userId: user.id,
          tokenType: UserTokenTypesEnum.PASSWORD_RESET,
        });

        if (userToken) {
          await UserTokensService.deactivateUserToken(userToken.id);
        }

        const token = generateStringOfLength(
          businessConfig.passwordResetTokenLength
        );

        const expiresOn = businessConfig.currentDateTime.plus({
          minute: businessConfig.passwordResetTokenExpiresInMinutes,
        });

        const passwordResetToken =
          await UserTokensService.createUserTokenRecord({
            userId: user.id,
            tokenType: UserTokenTypesEnum.PASSWORD_RESET,
            token,
            queryRunner,
            expiresOn,
          });

        const passwordResetLink = `${businessConfig.passwordResetTokenLink}/${passwordResetToken.token}`;

        const sendPasswordResetLinkDto: SendPasswordResetLinkDtoType = {
          userEmail: user.email,
          passwordResetLink: passwordResetLink,
        };

        await EmailService.sendPasswordResetLink(sendPasswordResetLinkDto);

        await queryRunner.commitTransaction();

        return response.status(HttpStatusCodeEnum.OK).json({
          status_code: HttpStatusCodeEnum.OK,
          status: SUCCESS,
          message: PASSWORD_RESET_LINK_GENERATED,
        });
      } catch (RequestPasswordResetLinkControllerError) {
        await queryRunner.rollbackTransaction();
        console.log(
          "🚀 ~ RequestPasswordResetLinkController.handle RequestPasswordResetLinkControllerError ->",
          RequestPasswordResetLinkControllerError
        );

        return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
          status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
          status: ERROR,
          message: SOMETHING_WENT_WRONG,
        });
      }
    } catch (RequestPasswordResetLinkControllerError) {
      console.log(
        "🚀 ~ RequestPasswordResetLinkController.handle RequestPasswordResetLinkControllerError ->",
        RequestPasswordResetLinkControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new RequestPasswordResetLinkController();
