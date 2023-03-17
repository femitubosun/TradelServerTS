import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  INFORMATION_UPDATED,
  NULL_OBJECT,
  PRODUCT_RESOURCE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import CartService from "Api/Modules/Client/Inventory/Services/CartService";
import ProductService from "Api/Modules/Client/Inventory/Services/ProductService";
import { RESOURCE_RECORD_NOT_FOUND } from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";
import CartItemService from "Api/Modules/Client/Inventory/Services/CartItemService";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";

const dbContext = container.resolve(DbContext);

class AddItemToCartController {
  public async handle(request: Request, response: Response) {
    try {
      const user = (request as AuthRequest).user;
      const { product_identifier: productIdentifier, quantity } = request.body;

      const product = await ProductService.getProductByIdentifier(
        productIdentifier
      );

      if (product == NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: ERROR,
          message: RESOURCE_RECORD_NOT_FOUND(PRODUCT_RESOURCE),
        });
      }

      const customer = await ProfileInternalApi.getCustomerByUserId(user.id);

      const cart = await CartService.getCartByCustomerId(customer!.id);

      const queryRunner = await dbContext.getTransactionalQueryRunner();

      await queryRunner.startTransaction();
      try {
        const newCartItem = await CartItemService.createCartItemRecord({
          productId: product.id,
          cartId: cart?.id,
          quantity,
          queryRunner,
        });

        const cartItems = cart?.items;

        cartItems?.push(newCartItem);

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
          message: INFORMATION_UPDATED,
        });
      } catch (AddProductToCartControllerError) {
        console.log(
          "🚀 ~ AddProductToCartController.handle AddProductToCartControllerError ->",
          AddProductToCartControllerError
        );

        await queryRunner.rollbackTransaction();

        return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
          status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
          status: ERROR,
          message: SOMETHING_WENT_WRONG,
        });
      }
    } catch (AddProductToCartControllerError) {
      console.log(
        "🚀 ~ AddProductToCartController.handle AddProductToCartControllerError ->",
        AddProductToCartControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new AddItemToCartController();
