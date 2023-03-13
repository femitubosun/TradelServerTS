import CustomersService from "Api/Modules/Client/Profile/Services/CustomersService";
import { CreateCustomerRecordDtoType } from "Api/Modules/Client/Profile/TypeChecking";
import { CreateMerchantRecordDtoType } from "Api/Modules/Client/Profile/TypeChecking/Merchant";
import MerchantService from "Api/Modules/Client/Profile/Services/MerchantService";

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
}
