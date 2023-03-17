import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  INFORMATION_RETRIEVED,
  NOT_APPLICABLE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import CartService from "Api/Modules/Client/Inventory/Services/CartService";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import ProductService from "Api/Modules/Client/Inventory/Services/ProductService";

class FetchCartController {
  public async handle(request: Request, response: Response) {
    try {
      const user = (request as AuthRequest).user;
      const customer = await ProfileInternalApi.getCustomerByUserId(user.id);

      const cart = await CartService.getCartByCustomerId(customer!.id);

      const items = cart!.items;
      const mutatedItems = [];

      for (const item of items) {
        const product = await ProductService.getProductById(item.productId);

        const itemData = {
          identifier: item.identifier,
          product: {
            name: product!.name,
            name_slug: product!.nameSlug,
            description: product!.description || NOT_APPLICABLE,
            base_price: product!.basePrice,
            meta: {
              created_at: product!.createdAt,
              updated_at: product!.updatedAt,
            },
          },
          quantity: item.quantity,
        };

        mutatedItems.push(itemData);
      }

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: INFORMATION_RETRIEVED,
        results: {
          items: mutatedItems,
          count: mutatedItems.length,
        },
      });
    } catch (FetchCartControllerError) {
      console.log(
        "🚀 ~ FetchCartController.handle FetchCartControllerError ->",
        FetchCartControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new FetchCartController();
