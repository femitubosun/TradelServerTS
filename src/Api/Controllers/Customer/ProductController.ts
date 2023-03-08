import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import { Request, Response } from "express";
import {
  PRODUCT_CATEGORY_RESOURCE,
  NULL_OBJECT,
  PRODUCT_RESOURCE,
  SUCCESS,
  INTERNAL_SERVER_ERROR,
  ERROR,
  SOMETHING_WENT_WRONG,
} from "Helpers/Messages/SystemMessages";
import {
  RESOURCE_FETCHED_SUCCESSFULLY,
  RECORD_NOT_FOUND,
} from "Helpers/Messages/SystemMessageFunctions";
import ProductService from "Logic/Services/ProductService";
import MerchantService from "Logic/Services/MerchantService";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";

const dbContext = container.resolve(DbContext);

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

  public async getActiveProductByIdentifier(
    request: Request,
    response: Response
  ) {
    let statusCode = HttpStatusCodeEnum.OK;

    const { productIdentifier } = request.params;

    const product = await ProductService.getProductByIdentifier(
      productIdentifier
    );

    if (product == NULL_OBJECT) {
      statusCode = HttpStatusCodeEnum.NOT_FOUND;

      return response.status(statusCode).json({
        status_code: statusCode,
        status: ERROR,
        message: RECORD_NOT_FOUND(PRODUCT_CATEGORY_RESOURCE),
      });
    }

    const IS_INACTIVE = false;
    const IS_DELETED = true;

    if (product.isActive == IS_INACTIVE || product.isDeleted == IS_DELETED) {
      statusCode = HttpStatusCodeEnum.NOT_FOUND;

      return response.status(statusCode).json({
        status_code: statusCode,
        status: ERROR,
        message: RECORD_NOT_FOUND(PRODUCT_CATEGORY_RESOURCE),
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
        meta: {
          merchant_identifier: productMerchant?.identifier,
          product_variants: [],
        },
      },
    });
  }

  public async createProduct(request: Request, response: Response) {
    try {
      const {
        name,
        description,
        base_price: basePrice,
        merchant_id: merchantId,
      } = request.body;

      const queryRunner = await dbContext.getTransactionalQueryRunner();

      await queryRunner.startTransaction();

      try {
        const product = await ProductService.createProductRecord({
          name,
          description,
          basePrice,
          merchantId,
          queryRunner,
        });

        await queryRunner.commitTransaction();

        return response.status(HttpStatusCodeEnum.CREATED).json({
          status_code: HttpStatusCodeEnum.CREATED,
          status: SUCCESS,
          message: "Product Created Successfully",
          results: {
            name: product.name,
            name_slug: product.nameSlug,
            description: product.description,
            base_price: product.basePrice,
            meta: {
              created_at: product.createdAt,
            },
          },
        });
      } catch (createProductControllerError) {
        console.log(
          "🚀 ~ ProductController.createProduct createProductControllerError ->",
          createProductControllerError
        );

        await queryRunner.rollbackTransaction();

        return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
          status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
          status: ERROR,
          message: SOMETHING_WENT_WRONG,
        });
      }
    } catch (createProductError) {
      console.log(
        "🚀 ~ ProductController.createProduct createProductError ->",
        createProductError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new ProductController();
