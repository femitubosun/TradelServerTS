import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  INFORMATION_RETRIEVED,
  NOT_APPLICABLE,
  NULL_OBJECT,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import CartService from "Api/Modules/Client/Inventory/Services/CartService";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import ProductVariantService from "Api/Modules/Client/Inventory/Services/ProductVariantService";
import * as console from "console";
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
        if (item.isProduct) {
          const product = await ProductService.getProductById(item.productId);

          if (product == NULL_OBJECT) continue;

          mutatedItems.push({
            identifier: item.identifier,
            product: { ...product.forClient },
            quantity: item.quantity,
            price: product.basePrice * item.quantity,
          });

          continue;
        }
        const productVariant =
          await ProductVariantService.getProductVariantById(
            item.productVariantId
          );

        if (productVariant === NULL_OBJECT) {
          continue;
        }

        const itemData = {
          identifier: item.identifier,
          product: {
            name: productVariant.product.name,
            name_slug: productVariant.product.nameSlug,
            description: productVariant.product.description || NOT_APPLICABLE,
            price: productVariant.price,
            parent_variants: productVariant.parentVariants,
            meta: {
              created_at: productVariant.product!.createdAt,
              updated_at: productVariant.product!.updatedAt,
            },
          },
          quantity: item.quantity,
          price: productVariant.price * item.quantity,
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
