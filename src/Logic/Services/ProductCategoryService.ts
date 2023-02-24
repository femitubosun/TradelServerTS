import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { ProductCategory } from "Entities/ProductCategory";
import { CreateProductCategoryDtoType } from "TypeChecking/ProductCategory/CreateProductCategoryDtoType";
import { Repository } from "typeorm";
import { NULL_OBJECT } from "../../Helpers/Messages/SystemMessages";

@autoInjectable()
class ProductCategoryService {
  private productCategoryRepository;

  constructor(private dbContext?: DbContext) {
    this.productCategoryRepository = dbContext?.getEntityRepository(
      ProductCategory
    ) as Repository<ProductCategory>;
  }

  public async createProductCategoryRecord(
    createProductCategoryRecordDto: CreateProductCategoryDtoType
  ) {
    const { queryRunner } = createProductCategoryRecordDto;

    const productCategoryInfo = new ProductCategory();

    Object.assign(productCategoryInfo, createProductCategoryRecordDto);

    await queryRunner.manager.save(productCategoryInfo);

    return productCategoryInfo;
  }

  public async listActiveProductCategory() {
    return await this.productCategoryRepository.findBy({
      isActive: true,
    });
  }

  public async listAllProductCategory() {
    return await this.productCategoryRepository.findBy({});
  }

  public async getProductCategoryByIdentifier(
    productCategoryIdentifier: string
  ): Promise<ProductCategory | null> {
    const productCategory = this.productCategoryRepository.findOneBy({
      identifier: productCategoryIdentifier,
    });

    return productCategory || NULL_OBJECT;
  }
}

export default new ProductCategoryService();
