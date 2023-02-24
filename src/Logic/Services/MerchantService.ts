import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { Merchant } from "Entities/Merchant";
import { FAILURE, NULL_OBJECT, SUCCESS } from "Helpers/Messages/SystemMessages";
import {
  DeleteMerchantArgs,
  CreateMerchantRecordArgs,
  DisableMerchantRecordArgs,
  UpdateMerchantRecordArgs,
} from "TypeChecking/Merchant";
import { Repository } from "typeorm";

@autoInjectable()
class MerchantService {
  private merchantsRepository;

  constructor(private dbContext?: DbContext) {
    this.merchantsRepository = dbContext?.getEntityRepository(
      Merchant
    ) as Repository<Merchant>;
  }

  public async createMerchantRecord(
    createMerchantRecordArgs: CreateMerchantRecordArgs
  ) {
    const { userId, queryRunner, phoneNumber, storeName } =
      createMerchantRecordArgs;
    const foundMerchant = await this.findMerchantByUserId(userId);

    if (foundMerchant) return foundMerchant;

    const merchant = new Merchant();

    Object.assign(merchant, {
      userId,
      phoneNumber,
      storeName,
    });

    await queryRunner.manager.save(merchant);

    return merchant;
  }

  public async getMerchantById(merchantId: number): Promise<Merchant | null> {
    const merchant = this.merchantsRepository?.findOneById(merchantId);
    return merchant || NULL_OBJECT;
  }

  public async getMerchantByIdentifier(merchantIdentifier: string) {
    const merchant = this.merchantsRepository?.findOneBy({
      identifier: merchantIdentifier,
    });
    return merchant || NULL_OBJECT;
  }

  public async getMerchantByStoreSlug(storeSlug: string) {
    const merchant = this.merchantsRepository?.findOneBy({
      storeNameSlug: storeSlug,
    });
    return merchant || NULL_OBJECT;
  }

  public async updateMerchantRecord(
    updateMerchantRecordArgs: UpdateMerchantRecordArgs
  ) {
    const { identifierValue, identifierType, updatePayload } =
      updateMerchantRecordArgs;

    const merchant =
      identifierType == "id"
        ? await this.getMerchantById(identifierValue as number)
        : await this.getMerchantByIdentifier(identifierValue as string);

    if (merchant == NULL_OBJECT) return;
    Object.assign(merchant, updatePayload);
    try {
      await this.merchantsRepository.save(merchant);
      return SUCCESS;
    } catch (e) {
      console.log(e);
      return FAILURE;
    }
  }

  public async deleteMerchantRecord(
    deleteMerchantRecordArgs: DeleteMerchantArgs
  ) {
    const { identifierValue, identifierType } = deleteMerchantRecordArgs;
    const merchant =
      identifierType == "id"
        ? await this.getMerchantById(identifierValue as number)
        : await this.getMerchantByIdentifier(identifierValue as string);

    if (merchant == NULL_OBJECT) return;

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
    const { identifierValue, identifierType } = disableMerchantRecordArgs;
    const merchant =
      identifierType == "id"
        ? await this.getMerchantById(identifierValue as number)
        : await this.getMerchantByIdentifier(identifierValue as string);

    if (merchant == NULL_OBJECT) return;
    merchant.isActive = false;
    await this.merchantsRepository.save(merchant);
  }

  public async findMerchantByUserId(userId: number) {
    const merchant = await this.merchantsRepository.findOneBy({
      userId,
    });

    return merchant || NULL_OBJECT;
  }
}

export default new MerchantService();
