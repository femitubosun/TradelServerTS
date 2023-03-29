import CustomersService from "Api/Modules/Client/Profile/Services/CustomersService";
import { CreateCustomerRecordDtoType } from "Api/Modules/Client/Profile/TypeChecking";
import { CreateMerchantRecordDtoType } from "Api/Modules/Client/Profile/TypeChecking/Merchant";
import MerchantService from "Api/Modules/Client/Profile/Services/MerchantService";
import { GetCustomerUserIdDto } from "Api/Modules/Client/Profile/TypeChecking/GeneralPurpose/GetCustomerUserIdDto";
import { GetMerchantUserIdDto } from "Api/Modules/Client/Profile/TypeChecking/GeneralPurpose/GetMerchantUserIdDto";

export class ProfileInternalApi {
  public static async createCustomerRecord(
    createCustomerRecordDto: CreateCustomerRecordDtoType
  ) {
    return await CustomersService.createCustomerRecord(createCustomerRecordDto);
  }

  public static async createMerchantRecord(
    createMerchantDto: CreateMerchantRecordDtoType
  ) {
    return await MerchantService.createMerchantRecord(createMerchantDto);
  }

  public static async getMerchantByUserId(userId: number) {
    return await MerchantService.getMerchantByUserId(userId);
  }

  public static async getMerchantById(merchantId: number) {
    return await MerchantService.getMerchantById(merchantId);
  }

  public static async getMerchantByIdentifier(identifier: string) {
    return await MerchantService.getMerchantByIdentifier(identifier);
  }

  public static async getCustomerByUserId(userId: number) {
    return await CustomersService.getCustomerByUserId(userId);
  }

  public static async getCustomerUserId(
    getCustomerUserIdDto: GetCustomerUserIdDto
  ) {
    return await CustomersService.getCustomerUserId(getCustomerUserIdDto);
  }

  public static async getMerchantUserId(
    getMerchantUserIdDto: GetMerchantUserIdDto
  ) {
    return await MerchantService.getMerchantUserId(getMerchantUserIdDto);
  }

  public static async listActiveMerchants() {
    return await MerchantService.listActiveMerchants();
  }
}
