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
import { RECORD_NOT_FOUND } from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";

class RemoveProductFromCartController {
  public async handle(request: Request, response: Response) {
    try {
      const user = (request as AuthRequest).user;
      const { product_identifier: productIdentifier } = request.body;

      const product = await ProductService.getProductByIdentifier(
        productIdentifier
      );

      if (product === NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: ERROR,
          message: RECORD_NOT_FOUND(PRODUCT_RESOURCE),
        });
      }

      const customer = await ProfileInternalApi.getCustomerByUserId(user.id);

      const cart = await CartService.getCartByCustomerId(customer!.id);

      let cartProducts = cart?.products;

      cartProducts = cartProducts?.filter(
        (cartProduct) => cartProduct.id !== product.id
      );

      await CartService.updateCartRecord({
        identifierType: "id",
        identifier: cart!.id,
        updatePayload: {
          products: cartProducts,
        },
      });

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: INFORMATION_UPDATED,
      });
    } catch (RemoveProductFromCartControllerError) {
      console.log(
        "🚀 ~ RemoveProductFromCartController.handle RemoveProductFromCartControllerError ->",
        RemoveProductFromCartControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new RemoveProductFromCartController();
