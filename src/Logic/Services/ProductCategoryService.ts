import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { ProductCategory } from "Entities/ProductCategory";
import { CreateProductCategoryDtoType } from "TypeChecking/ProductCategory/CreateProductCategoryDtoType";
import { assignWith } from "lodash";

@autoInjectable()
class ProductCategoryService {
  private productCategoryRepository: any;

  constructor(private dbContext?: DbContext) {
    this.productCategoryRepository =
      dbContext?.getEntityRepository(ProductCategory);
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
}

export default new ProductCategoryService();
