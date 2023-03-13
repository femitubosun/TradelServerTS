// import { Request, Response } from "express";
// import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
// import MerchantService from "Api/Modules/Client/Profile/Services/MerchantService";
// import {
//   ERROR,
//   MERCHANT_RESOURCE,
//   NULL_OBJECT,
//   PRODUCT_CATEGORY_RESOURCE,
//   SUCCESS,
// } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
// import {
//   RESOURCE_FETCHED_SUCCESSFULLY,
//   RECORD_NOT_FOUND,
// } from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";
// import ProductService from "Api/Modules/Client/InventoryAndCatalogue/Services/ProductService";
//
// class MerchantController {
//   public async listActiveMerchants(request: Request, response: Response) {
//     const statusCode = HttpStatusCodeEnum.OK;
//
//     const merchants = await MerchantService.listActiveMerchantRecords();
//
//     const mutantMerchants: object[] = [];
//
//     for (const merchant of merchants) {
//       const {
//         identifier,
//         storeName: store_name,
//         storeNameSlug: store_name_slug,
//         photoUrl: photo_url,
//       } = merchant;
//
//       mutantMerchants.push({
//         identifier,
//         store_name,
//         store_name_slug,
//         photo_url,
//       });
//     }
//
//     return response.status(statusCode).json({
//       status_code: statusCode,
//       status: SUCCESS,
//       message: RESOURCE_FETCHED_SUCCESSFULLY(MERCHANT_RESOURCE),
//       results: mutantMerchants,
//     });
//   }
//
//   public async getActiveMerchantByIdentifier(
//     request: Request,
//     response: Response
//   ) {
//     let statusCode = HttpStatusCodeEnum.OK;
//
//     const { merchantIdentifier } = request.params;
//
//     const merchant = await MerchantService.getMerchantByIdentifier(
//       merchantIdentifier
//     );
//
//     if (merchant == NULL_OBJECT) {
//       statusCode = HttpStatusCodeEnum.NOT_FOUND;
//
//       return response.status(statusCode).json({
//         status_code: statusCode,
//         status: ERROR,
//         message: RECORD_NOT_FOUND(MERCHANT_RESOURCE),
//       });
//     }
//
//     const IS_INACTIVE = false;
//     const IS_DELETED = true;
//
//     if (merchant.isActive === IS_INACTIVE || merchant.isDeleted == IS_DELETED) {
//       statusCode = HttpStatusCodeEnum.NOT_FOUND;
//
//       return response.status(statusCode).json({
//         status_code: statusCode,
//         status: ERROR,
//         message: RECORD_NOT_FOUND(MERCHANT_RESOURCE),
//       });
//     }
//
//     const merchantProducts =
//       await ProductService.listActiveProductsByMerchantId(merchant.id);
//
//     const mutantProducts: object[] = [];
//
//     for (const product of merchantProducts) {
//       const {
//         identifier,
//         name,
//         nameSlug: name_slug,
//         description,
//         basePrice: price,
//       } = product;
//
//       mutantProducts.push({
//         identifier,
//         name,
//         name_slug,
//         description,
//         price,
//       });
//     }
//
//     return response.status(statusCode).json({
//       status_code: statusCode,
//       status: SUCCESS,
//       message: RESOURCE_FETCHED_SUCCESSFULLY(PRODUCT_CATEGORY_RESOURCE),
//       results: {
//         identifier: merchant.identifier,
//         store_name: merchant.storeName,
//         store_name_slug: merchant.storeName,
//         photo_url: merchant.photoUrl,
//         products: mutantProducts,
//       },
//     });
//   }
// }
//
// export default new MerchantController();
