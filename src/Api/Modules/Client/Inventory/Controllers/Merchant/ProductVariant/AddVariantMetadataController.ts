import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  NULL_OBJECT,
  PRODUCT_RESOURCE,
  PRODUCT_VARIANT_RESOURCE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
  UNAUTHORIZED_OPERATION,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import ProductVariantMetadataService from "Api/Modules/Client/Inventory/Services/ProductVariantMetadataService";
import {
  RESOURCE_RECORD_CREATED_SUCCESSFULLY,
  RESOURCE_RECORD_NOT_FOUND,
} from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import ProductService from "Api/Modules/Client/Inventory/Services/ProductService";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import * as console from "console";

class AddVariantMetadataController {
  public async handle(request: Request, response: Response) {
    try {
      const { productIdentifier } = request.params;
      const { variant_label: variant_label, variant_options: variantOptions } =
        request.body;
      const user = (request as AuthRequest).user;
      const merchant = await ProfileInternalApi.getMerchantByUserId(user.id);

      const product = await ProductService.getProductByIdentifier(
        productIdentifier
      );

      if (product === NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: ERROR,
          message: RESOURCE_RECORD_NOT_FOUND(PRODUCT_RESOURCE),
        });
      }

      if (product.merchantId !== merchant!.id) {
        return response.status(HttpStatusCodeEnum.FORBIDDEN).json({
          status_code: HttpStatusCodeEnum.FORBIDDEN,
          status: ERROR,
          message: UNAUTHORIZED_OPERATION,
        });
      }

      const { productVariantMetadata: existingProductVariantMetadata } =
        await ProductVariantMetadataService.getProductVariantByProductId(
          product.id
        );

      if (existingProductVariantMetadata) {
        let existingVariantOptions =
          existingProductVariantMetadata.variantOptions;

        const variantIndex = existingVariantOptions.findIndex(
          (variantOption: { label: string; options: string[] }) =>
            variantOption.label === variant_label
        );

        if (variantIndex > -1) {
          existingVariantOptions = existingVariantOptions.filter(
            (variantOption) => variantOption.label != variant_label
          );
        }

        existingVariantOptions.push({
          label: variant_label,
          options: variantOptions,
        });

        const { forClient: productVariantMetadatForClient } =
          await ProductVariantMetadataService.updateProductVariantMetadataRecord(
            {
              identifier: product.id,
              identifierType: "productId",
              updatePayload: {
                variantOptions: existingVariantOptions,
              },
            }
          );

        return response.status(HttpStatusCodeEnum.CREATED).json({
          status_code: HttpStatusCodeEnum.CREATED,
          status: SUCCESS,
          message: RESOURCE_RECORD_CREATED_SUCCESSFULLY(
            PRODUCT_VARIANT_RESOURCE
          ),
          results: productVariantMetadatForClient,
        });
      }

      const { forClient: productVariantMetadataForClient } =
        await ProductVariantMetadataService.createProductVariantMetadataRecord({
          productId: product.id,
          variantOptions: [
            {
              label: variant_label,
              options: variantOptions,
            },
          ],
        });

      return response.status(HttpStatusCodeEnum.CREATED).json({
        status_code: HttpStatusCodeEnum.CREATED,
        status: SUCCESS,
        message: RESOURCE_RECORD_CREATED_SUCCESSFULLY(PRODUCT_VARIANT_RESOURCE),
        results: productVariantMetadataForClient,
      });
    } catch (CreateProductVariantControllerError) {
      console.log(
        "🚀 ~ CreateProductVariantController.handle CreateProductVariantControllerError ->",
        CreateProductVariantControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new AddVariantMetadataController();
