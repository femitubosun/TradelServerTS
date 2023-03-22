import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  CART_ITEM_REMOVED_SUCCESS,
  CART_ITEM_RESOURCE,
  ERROR,
  NULL_OBJECT,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import CartService from "Api/Modules/Client/Inventory/Services/CartService";
import { RESOURCE_RECORD_NOT_FOUND } from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import CartItemService from "Api/Modules/Client/Inventory/Services/CartItemService";

const dbContext = container.resolve(DbContext);

class RemoveItemFromCartController {
  public async handle(request: Request, response: Response) {
    const queryRunner = await dbContext.getTransactionalQueryRunner();

    await queryRunner.startTransaction();

    try {
      const user = (request as AuthRequest).user;
      const { cart_item_identifier: cartItemIdentifier } = request.body;

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

      const customer = await ProfileInternalApi.getCustomerByUserId(user.id);

      const cart = await CartService.getCartByCustomerId(customer!.id);

      let cartItems = cart?.items;

      cartItems = cartItems?.filter((item) => item.id !== cartItem.id);

      await CartService.updateCartRecord({
        identifierType: "id",
        identifier: cart!.id,
        updatePayload: {
          items: cartItems,
        },
        queryRunner,
      });

      await queryRunner.commitTransaction();

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: CART_ITEM_REMOVED_SUCCESS,
      });
    } catch (RemoveItemFromCartControllerError) {
      console.log(
        "🚀 ~ RemoveItemFromCartControllerError.handle RemoveItemFromCartControllerError ->",
        RemoveItemFromCartControllerError
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

export default new RemoveItemFromCartController();
