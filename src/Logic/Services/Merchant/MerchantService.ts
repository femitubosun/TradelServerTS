import { autoInjectable } from "tsyringe";
import { DBContext } from "Lib/Infra/Internal/DBContext";
import { Merchant } from "Entities/Merchant";
import { CreateMerchantRecordArgs } from "Logic/Services/Merchant/TypeChecking/CreateMerchantRecordArgs";
import { FAILURE, NULL_OBJECT, SUCCESS } from "Utils/Messages";
import {
  DeleteMerchantArgs,
  DisableMerchantRecordArgs,
  UpdateMerchantRecordArgs,
} from "Logic/Services/Merchant/TypeChecking";
import { LoggingProviderFactory } from "Lib/Infra/Internal/Logging";

@autoInjectable()
class MerchantService {
  private merchantsRepository: any;

  constructor(private dbContext?: DBContext) {
    this.merchantsRepository = dbContext?.getEntityRepository(Merchant);
  }

  public async createMerchantRecord(
    createMerchantRecordArgs: CreateMerchantRecordArgs
  ) {
    const { user, queryRunner, phoneNumber, storeName } =
      createMerchantRecordArgs;

    const foundMerchant = this.findMerchantByUserId(user.id);

    if (foundMerchant !== NULL_OBJECT) return foundMerchant;

    const merchant = new Merchant();

    Object.assign(merchant, {
      user,
      phoneNumber,
      storeName,
    });

    await queryRunner.manager.save(merchant);

    return merchant;
  }

  public async getMerchantById(merchantId: number): Promise<Merchant | null> {
    const merchant = this.merchantsRepository.findOneById(merchantId);
    if (!merchant) return NULL_OBJECT;
    return merchant;
  }

  public async getMerchantByIdentifier(merchantIdentifier: string) {
    const merchant = this.merchantsRepository.findOneBy({
      identifier: merchantIdentifier,
    });
    if (!merchant) return NULL_OBJECT;
    return merchant;
  }

  public async getMerchantByStoreSlug(storeSlug: string) {
    const merchant = this.merchantsRepository.findOneBy({
      storeNameSlug: storeSlug,
    });
    if (!merchant) return NULL_OBJECT;
    return merchant;
  }

  public async updateMerchantRecord(
    updateMerchantRecordArgs: UpdateMerchantRecordArgs
  ) {
    const { identifier, identifierType, updatePayload } =
      updateMerchantRecordArgs;

    const merchant =
      identifierType == "id"
        ? await this.getMerchantById(identifier as number)
        : await this.getMerchantByIdentifier(identifier as string);

    Object.assign(merchant, updatePayload);
    try {
      await this.merchantsRepository.save(merchant);
      return SUCCESS;
    } catch (e) {
      const logger = LoggingProviderFactory.build();
      console.log(e);
      logger.error(e);
      return FAILURE;
    }
  }

  public async deleteMerchantRecord(
    deleteMerchantRecordArgs: DeleteMerchantArgs
  ) {
    const { identifier, identifierType } = deleteMerchantRecordArgs;
    const merchant =
      identifierType == "id"
        ? await this.getMerchantById(identifier as number)
        : await this.getMerchantByIdentifier(identifier as string);

    merchant.isDeleted = true;
    merchant.isActive = false;
    await this.merchantsRepository.save(merchant);
  }

  public async listActiveMerchantRecords() {
    return await this.merchantsRepository.findBy({
      isActive: true,
    });
  }

  public async listAllMerchantRecords() {
    return await this.merchantsRepository.findBy({});
  }

  public async listDisabledMerchantRecords() {
    return await this.merchantsRepository.findOneBy({
      isDeleted: true,
    });
  }

  public async disableMerchantRecord(
    disableMerchantRecordArgs: DisableMerchantRecordArgs
  ) {
    const { identifier, identifierType } = disableMerchantRecordArgs;
    const merchant =
      identifierType == "id"
        ? await this.getMerchantById(identifier as number)
        : await this.getMerchantByIdentifier(identifier as string);

    merchant.isActive = false;
    await this.merchantsRepository.save(merchant);
  }

  public async findMerchantByUserId(userId: number) {
    const merchant = this.merchantsRepository.findOneBy({
      userId,
    });

    if (!merchant) return NULL_OBJECT;

    return merchant;
  }
}

export default new MerchantService();
