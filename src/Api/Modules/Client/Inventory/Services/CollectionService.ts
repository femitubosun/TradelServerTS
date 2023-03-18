import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { Collection } from "Api/Modules/Client/Inventory/Entities";
import { Repository } from "typeorm";
import { CreateCollectionRecordDto } from "Api/Modules/Client/Inventory/TypeChecking/Collection/CreateCollectionRecordDto";
import { NULL_OBJECT } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { DeleteRecordDto } from "Api/Modules/Client/Inventory/TypeChecking/GeneralPurpose/DeleteRecordDto";
import { UpdateCollectionRecordDto } from "Api/Modules/Client/Inventory/TypeChecking/Collection/UpdateCollectionRecordDto";

@autoInjectable()
class CollectionService {
  private collectionsRepository;

  constructor(private dbContext?: DbContext) {
    this.collectionsRepository = dbContext?.getEntityRepository(
      Collection
    ) as Repository<Collection>;
  }

  /**
   * @description This method creates a collection record
   * @author Femi, Ayo-Tubosun. E.
   * @param {CreateCollectionRecordDto} createCollectionDto
   * @returns Promise<Collection>
   * @memberOf CollectionService
   */
  public async createCollectionRecord(
    createCollectionDto: CreateCollectionRecordDto
  ) {
    const { queryRunner, label, merchantId } = createCollectionDto;

    const collection = new Collection();

    Object.assign(collection, {
      label,
      merchantId,
    });

    await queryRunner.manager.save(collection);

    return collection;
  }

  /**
   * @description This method gets a collection by its primary key
   * @returns Promise<Collection|null>
   * @memberOf CollectionService
   * @param collectionId
   */
  public async getCollectionById(collectionId: number) {
    const collectionsList = await this.collectionsRepository.find({
      where: {
        id: collectionId,
        isActive: true,
        isDeleted: false,
      },
      relations: {
        items: true,
      },
      take: 1,
    });

    const collection = collectionsList[0];

    return collection || NULL_OBJECT;
  }

  public async getCollectionByIdentifier(identifier: string) {
    const collectionsList = await this.collectionsRepository.find({
      where: {
        identifier,
        isActive: true,
        isDeleted: false,
      },
      relations: {
        items: true,
      },
      take: 1,
    });

    const collection = collectionsList[0];

    return collection || NULL_OBJECT;
  }

  public async listActiveCollections() {
    return await this.collectionsRepository.find({
      where: {
        isActive: true,
        isDeleted: false,
      },
    });
  }

  public async listAllCollections() {
    return await this.collectionsRepository.find({});
  }

  public async listDisabledCollections() {
    return await this.collectionsRepository.find({
      where: {
        isActive: false,
        isDeleted: true,
      },
    });
  }

  public async listActiveCollectionsByMerchantId(merchantId: number) {
    return await this.collectionsRepository.find({
      where: {
        merchantId,
        isActive: true,
        isDeleted: false,
      },
    });
  }

  public async listDisabledCollectionsByMerchantId(merchantId: number) {
    return await this.collectionsRepository.find({
      where: {
        merchantId,
        isActive: false,
        isDeleted: true,
      },
    });
  }

  public async deleteCollection(deleteCollectionDto: DeleteRecordDto) {
    const { identifier, identifierType, queryRunner } = deleteCollectionDto;

    const collection =
      identifierType === "id"
        ? await this.getCollectionById(identifier as number)
        : await this.getCollectionByIdentifier(identifier as string);

    if (collection === NULL_OBJECT) return;

    Object.assign(collection, {
      isDeleted: true,
      isActive: false,
    });

    await queryRunner.manager.save(collection);

    return collection;
  }

  public async updateCollection(
    updateCollectionDto: UpdateCollectionRecordDto
  ) {
    const { identifier, identifierType, updatePayload, queryRunner } =
      updateCollectionDto;

    const collection =
      identifierType === "id"
        ? await this.getCollectionById(identifier as number)
        : await this.getCollectionByIdentifier(identifier as string);

    if (collection === NULL_OBJECT) return;

    Object.assign(collection, updatePayload);

    await queryRunner.manager.save(collection);

    return collection;
  }
}

export default new CollectionService();
