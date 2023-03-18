import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  CART_ITEM_RESOURCE,
  ERROR,
  INFORMATION_UPDATED,
  NULL_OBJECT,
  SOMETHING_WENT_WRONG,
  SUCCESS,
  UNAUTHORIZED_OPERATION,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import CartService from "Api/Modules/Client/Inventory/Services/CartService";
import CartItemService from "Api/Modules/Client/Inventory/Services/CartItemService";
import { RESOURCE_RECORD_NOT_FOUND } from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";

const dbContext = container.resolve(DbContext);

class UpdateCartItemController {
  public async handle(request: Request, response: Response) {
    const queryRunner = await dbContext.getTransactionalQueryRunner();

    await queryRunner.startTransaction();
    try {
      const user = (request as AuthRequest).user;

      const { cartItemIdentifier } = request.params;
      const { quantity } = request.body;

      const customer = await ProfileInternalApi.getCustomerByUserId(user.id);

      const cart = await CartService.getCartByCustomerId(customer!.id);

      const cartItem = await CartItemService.getCartItemByIdentifier(
        cartItemIdentifier
      );

      if (cartItem === NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: ERROR,
          message: RESOURCE_RECORD_NOT_FOUND(CART_ITEM_RESOURCE),
        });
      }

      if (cartItem.cartId != cart!.id) {
        return response.status(HttpStatusCodeEnum.UNAUTHENTICATED).json({
          status_code: HttpStatusCodeEnum.FORBIDDEN,
          status: ERROR,
          message: UNAUTHORIZED_OPERATION,
        });
      }

      await CartItemService.updateCartItem({
        identifier: cartItemIdentifier,
        identifierType: "identifier",
        updatePayload: {
          quantity,
        },
        queryRunner,
      });

      await queryRunner.commitTransaction();

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: INFORMATION_UPDATED,
      });

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    } catch (UpdateCartItemControllerError) {
      console.log(
        "🚀 ~ UpdateCartItemController.handle UpdateCartItemControllerError ->",
        UpdateCartItemControllerError
      );
      await queryRunner.rollbackTransaction();

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new UpdateCartItemController();
