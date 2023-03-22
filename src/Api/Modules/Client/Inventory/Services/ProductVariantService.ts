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

  /**
   * @descriptions This method generates arrays of variant combinations
   * @param variants
   * @memberOf ProductVariantService
   */
  public async generateVariantCombination(
    variants: string[][]
  ): Promise<string[][]> {
    return variants;
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

    return {
      productVariant,
      forClient: {
        identifier: productVariant.identifier,
        sku: productVariant.sku,
        price: productVariant.price,
        parent_variants: productVariant.variantParents,
        meta: {
          created_at: productVariant.createdAt,
          updated_at: productVariant.updatedAt,
        },
      },
    };
  }
}

export default new ProductVariantService();
