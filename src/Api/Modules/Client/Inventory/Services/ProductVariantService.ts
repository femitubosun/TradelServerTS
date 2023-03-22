import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { ProductVariant } from "Api/Modules/Client/Inventory/Entities";
import { Repository } from "typeorm";
import { CreateProductVariantDto } from "Api/Modules/Client/Inventory/TypeChecking/ProductVariant/CreateProductVariantDto";

@autoInjectable()
class ProductVariantService {
  private productVariantsRepository;

  constructor(private dbContext?: DbContext) {
    this.productVariantsRepository = dbContext?.getEntityRepository(
      ProductVariant
    ) as Repository<ProductVariant>;
  }

  public async createProductVariantRecord(
    createProductVariantRecordDto: CreateProductVariantDto
  ) {
    const { sku, price, productId, parentVariants, queryRunner } =
      createProductVariantRecordDto;

    const productVariant = new ProductVariant();

    Object.assign(productVariant, {
      sku,
      price,
      productId,
      parentVariants,
    });

    await queryRunner.manager.save(productVariant);

    return productVariant;
  }

  public async listProductVariantsByProductId(productId: number) {
    return await this.productVariantsRepository.findBy({
      productId,
    });
  }
}

export default new ProductVariantService();
