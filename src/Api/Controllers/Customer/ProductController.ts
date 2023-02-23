import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import { Request, Response } from "express";
import { PRODUCT_RESOURCE, SUCCESS } from "Helpers/Messages/SystemMessages";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "Helpers/Messages/SystemMessageFunctions";

class ProductController {
  private oK = HttpStatusCodeEnum.OK;
  private internalServerError = HttpStatusCodeEnum.INTERNAL_SERVER_ERROR;

  public async listActiveProducts(req: Request, res: Response) {
    this.oK = HttpStatusCodeEnum.OK;
    return res.status(this.oK).json({
      status_code: this.oK,
      status: SUCCESS,
      message: RESOURCE_FETCHED_SUCCESSFULLY(PRODUCT_RESOURCE),
      results: [],
    });
  }
}

export default new ProductController();
