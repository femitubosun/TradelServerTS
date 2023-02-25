import { Request, Response } from "express";
import ProductCategoryService from "Logic/Services/ProductCategoryService";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  SUCCESS,
  PRODUCT_CATEGORY_RESOURCE,
  FAILURE,
  NULL_OBJECT,
} from "Helpers/Messages/SystemMessages";
import {
  RESOURCE_FETCHED_SUCCESSFULLY,
  RECORD_NOT_FOUND,
} from "Helpers/Messages/SystemMessageFunctions";
import ProductService from "Logic/Services/ProductService";

class ProductCategoryController {
  public async listActiveProductCategories(
    request: Request,
    response: Response
  ) {
    const statusCode = HttpStatusCodeEnum.OK;

    const productCategories =
      await ProductCategoryService.listActiveProductCategory();

    return response.status(statusCode).json({
      status_code: statusCode,
      status: SUCCESS,
      message: RESOURCE_FETCHED_SUCCESSFULLY(PRODUCT_CATEGORY_RESOURCE),
      results: productCategories,
    });
  }

  public async getProductCategory(request: Request, response: Response) {
    let statusCode = HttpStatusCodeEnum.OK;

    const { productCategoryIdentifier } = request.params;

    const productCategory =
      await ProductCategoryService.getProductCategoryByIdentifier(
        productCategoryIdentifier
      );

    if (productCategory == NULL_OBJECT) {
      statusCode = HttpStatusCodeEnum.NOT_FOUND;

      return response.status(statusCode).json({
        status_code: statusCode,
        status: FAILURE,
        message: RECORD_NOT_FOUND(PRODUCT_CATEGORY_RESOURCE),
      });
    }
    const IS_INACTIVE = false;
    const IS_DELETED = true;

    if (
      productCategory.isActive == IS_INACTIVE ||
      productCategory.isDeleted == IS_DELETED
    ) {
      statusCode = HttpStatusCodeEnum.NOT_FOUND;

      return response.status(statusCode).json({
        status_code: statusCode,
        status: FAILURE,
        message: RECORD_NOT_FOUND(PRODUCT_CATEGORY_RESOURCE),
      });
    }

    const productsInProductCategory =
      await ProductService.listActiveProductsByCategoryId(productCategory.id);

    const mutantProducts: Array<object> = [];

    for (const product of productsInProductCategory) {
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
      message: RESOURCE_FETCHED_SUCCESSFULLY(PRODUCT_CATEGORY_RESOURCE),
      results: {
        category: {
          identifier: productCategory.identifier,
          name: productCategory.name,
          name_slug: productCategory.nameSlug,
          photo_url: productCategory.photoUrl,
          products_count: mutantProducts.length,
          products: mutantProducts,
        },
      },
    });
  }
}

export default new ProductCategoryController();
