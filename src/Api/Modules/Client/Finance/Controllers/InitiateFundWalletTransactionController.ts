// import { Request, Response } from "express";
// import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
// import {
//   ERROR,
//   SOMETHING_WENT_WRONG,
//   SUCCESS,
// } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
// import { PaymentProviderFactory } from "Lib/Infra/External/Payment/PaymentProviderFactory";
//
// class InitiateFundWalletTransactionController {
//   public async handle(request: Request, response: Response) {
//     try {
//       const paymentProvider = PaymentProviderFactory.getPaymentProvider();
//
//       const transactionPayload = await paymentProvider!.initiateTransaction();
//
//       return response.status(HttpStatusCodeEnum.OK).json({
//         status_code: HttpStatusCodeEnum.OK,
//         status: SUCCESS,
//         message: "",
//         results: "",
//       });
//     } catch (InitiateTransactionForOrderControllerError) {
//       console.log(
//         "🚀 ~ InitiateTransactionForOrderController.handle InitiateTransactionForOrderControllerError ->",
//         InitiateTransactionForOrderControllerError
//       );
//
//       return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
//         status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
//         status: ERROR,
//         message: SOMETHING_WENT_WRONG,
//       });
//     }
//   }
// }
//
// export default new InitiateFundWalletTransactionController();
