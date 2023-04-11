import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { Merchant } from "Api/Modules/Client/Profile/Entities/Merchant";
import { NULL_OBJECT } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import {
  CreateMerchantRecordDtoType,
  DeleteMerchantArgs,
  DisableMerchantRecordArgs,
  UpdateMerchantRecordArgs,
} from "Api/Modules/Client/Profile/TypeChecking/Merchant";
import { Repository } from "typeorm";
import { GetMerchantUserIdDto } from "Api/Modules/Client/Profile/TypeChecking/GeneralPurpose/GetMerchantUserIdDto";

@autoInjectable()
class MerchantService {
  private merchantsRepository;

  constructor(private dbContext?: DbContext) {
    this.merchantsRepository = dbContext?.getEntityRepository(
      Merchant
    ) as Repository<Merchant>;
  }

  public async createMerchantRecord(
    createMerchantRecordDto: CreateMerchantRecordDtoType
  ) {
    const { userId, queryRunner, phoneNumber, storeName } =
      createMerchantRecordDto;
    const foundMerchant = await this.getMerchantByUserId(userId);

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
    const merchant = await this.merchantsRepository?.findOneById(merchantId);
    return merchant || NULL_OBJECT;
  }

  public async getMerchantByIdentifier(merchantIdentifier: string) {
    const merchant = await this.merchantsRepository?.findOneBy({
      identifier: merchantIdentifier,
      isActive: true,
      isDeleted: false,
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

    await this.merchantsRepository.save(merchant);

    return merchant;
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

  public async listActiveMerchants() {
    return await this.merchantsRepository.findBy({
      isActive: true,
      isDeleted: false,
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

  public async getMerchantByUserId(userId: number) {
    const merchant = await this.merchantsRepository.findOneBy({
      userId,
    });

    return merchant || NULL_OBJECT;
  }

  public async getMerchantUserId(getMerchantUserIdDto: GetMerchantUserIdDto) {
    const { identifier, identifierType } = getMerchantUserIdDto;

    const merchant =
      identifierType === "id"
        ? await this.getMerchantById(Number(identifier))
        : await this.getMerchantByIdentifier(String(identifier));

    if (merchant === NULL_OBJECT) return -1;

    return merchant.userId;
  }

  public async searchMerchant(searchQuery: string) {
    return this.merchantsRepository
      .createQueryBuilder()
      .select()
      .where("document_with_weights @@ plainto_tsquery(:query)", {
        query: `%${searchQuery}%`,
      })
      .orderBy(
        "ts_rank(document_with_weights, plainto_tsquery(:query))",
        "DESC"
      )
      .getMany();
  }
}

export default new MerchantService();
