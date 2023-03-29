import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  INFORMATION_UPDATED,
  NOT_APPLICABLE,
  NULL_OBJECT,
  PRODUCT_RESOURCE,
  PRODUCT_VARIANT_RESOURCE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import CartService from "Api/Modules/Client/Inventory/Services/CartService";
import { RESOURCE_RECORD_NOT_FOUND } from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";
import CartItemService from "Api/Modules/Client/Inventory/Services/CartItemService";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import ProductVariantService from "Api/Modules/Client/Inventory/Services/ProductVariantService";
import ProductService from "Api/Modules/Client/Inventory/Services/ProductService";

const dbContext = container.resolve(DbContext);

class AddItemToCartController {
  public async handle(request: Request, response: Response) {
    const queryRunner = await dbContext.getTransactionalQueryRunner();

    await queryRunner.startTransaction();
    try {
      const user = (request as AuthRequest).user;
      const {
        product_variant_identifier: productVariantIdentifier,
        product_identifier: productIdentifier,
        is_product: isProduct,
        quantity,
      } = request.body;

      const customer = await ProfileInternalApi.getCustomerByUserId(user.id);

      const cart = await CartService.getCartByCustomerId(customer!.id);

      if (isProduct) {
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

        const cartItem = await CartItemService.createCartItemRecord({
          product,
          cart: cart!,
          quantity,
          queryRunner,
        });

        const mutatedCartItem = {
          identifier: cartItem.identifier,
          product: {
            name: product.name,
            name_slug: product.nameSlug,
            description: product.description || NOT_APPLICABLE,
            price: product.basePrice,
            meta: {
              created_at: product!.createdAt,
              updated_at: product!.updatedAt,
            },
          },
          quantity: cartItem.quantity,
          price: product.basePrice * cartItem.quantity,
        };

        await queryRunner.commitTransaction();

        return response.status(HttpStatusCodeEnum.OK).json({
          status_code: HttpStatusCodeEnum.OK,
          status: SUCCESS,
          message: INFORMATION_UPDATED,
          results: mutatedCartItem,
        });
      }
      const productVariant =
        await ProductVariantService.getProductVariantByIdentifier(
          productVariantIdentifier
        );

      if (productVariant == NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: ERROR,
          message: RESOURCE_RECORD_NOT_FOUND(PRODUCT_VARIANT_RESOURCE),
        });
      }

      const cartItem = await CartItemService.createCartItemRecord({
        productVariant,
        cart: cart!,
        quantity,
        queryRunner,
      });

      const mutatedCartItem = {
        identifier: cartItem.identifier,
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
        quantity: cartItem.quantity,
        price: productVariant.price * cartItem.quantity,
      };

      await queryRunner.commitTransaction();

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: INFORMATION_UPDATED,
        results: mutatedCartItem,
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
  }
}

export default new AddItemToCartController();
