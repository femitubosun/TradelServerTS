import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import { Request, Response } from "express";
import {
  PRODUCT_CATEGORY_RESOURCE,
  FAILURE,
  NULL_OBJECT,
  PRODUCT_RESOURCE,
  SUCCESS,
} from "Helpers/Messages/SystemMessages";
import {
  RESOURCE_FETCHED_SUCCESSFULLY,
  RESOURCE_NOT_FOUND,
} from "Helpers/Messages/SystemMessageFunctions";
import ProductService from "Logic/Services/ProductService";
import MerchantService from "Logic/Services/MerchantService";

class ProductController {
  public async listActiveProducts(request: Request, response: Response) {
    const statusCode = HttpStatusCodeEnum.OK;

    const products = await ProductService.listActiveProducts();

    const mutantProducts: object[] = [];

    for (const product of products) {
      const {
        identifier,
        name,
        nameSlug: name_slug,
        description,
        basePrice: price,
      } = product;

      mutantProducts.push({
        identifier,
        name,
        name_slug,
        description,
        price,
      });
    }

    return response.status(statusCode).json({
      status_code: statusCode,
      status: SUCCESS,
      message: RESOURCE_FETCHED_SUCCESSFULLY(PRODUCT_RESOURCE),
      results: mutantProducts,
    });
  }

  public async getProductByIdentifier(request: Request, response: Response) {
    let statusCode = HttpStatusCodeEnum.OK;

    const { productIdentifier } = request.params;

    const product = await ProductService.getProductByIdentifier(
      productIdentifier
    );

    if (product == NULL_OBJECT) {
      statusCode = HttpStatusCodeEnum.NOT_FOUND;

      return response.status(statusCode).json({
        status_code: statusCode,
        status: FAILURE,
        message: RESOURCE_NOT_FOUND(PRODUCT_CATEGORY_RESOURCE),
      });
    }

    const IS_INACTIVE = false;

    if (product.isActive == IS_INACTIVE) {
      statusCode = HttpStatusCodeEnum.NOT_FOUND;

      return response.status(statusCode).json({
        status_code: statusCode,
        status: FAILURE,
        message: RESOURCE_NOT_FOUND(PRODUCT_CATEGORY_RESOURCE),
      });
    }
    const productMerchant = await MerchantService.getMerchantById(
      product.merchantId
    );

    return response.status(statusCode).json({
      status_code: statusCode,
      status: SUCCESS,
      message: RESOURCE_FETCHED_SUCCESSFULLY(PRODUCT_RESOURCE),
      results: {
        identifier: product.identifier,
        name: product.name,
        name_slug: product.nameSlug,
        descriptions: product.description,
        price: product.basePrice,
        photo_url: product.photoUrl,
        meta: {
          merchant_identifier: productMerchant?.identifier,
        },
      },
    });
  }
}

export default new ProductController();
