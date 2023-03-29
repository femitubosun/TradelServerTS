import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { ProductVariantOptions } from "Api/Modules/Client/Inventory/Entities";
import { Repository } from "typeorm";
import { CreateProductVariantOptionRecordDto } from "Api/Modules/Client/Inventory/TypeChecking/ProductVariantOption/CreateProductVariantOptionRecordDto";
import { NULL_OBJECT } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { UpdateProductVariantOptionsRecordDto } from "Api/Modules/Client/Inventory/TypeChecking/ProductVariantOption/UpdateProductVariantOptionsRecordDto";
import { IsCombinationInVariantOptionDto } from "Api/Modules/Client/Inventory/TypeChecking/ProductVariantOption/IsCombinationInVariantOptionDto";

@autoInjectable()
class ProductVariantOptionsService {
  private productVariantOptionsRepository;

  constructor(private dbContext?: DbContext) {
    this.productVariantOptionsRepository = dbContext?.getEntityRepository(
      ProductVariantOptions
    ) as Repository<ProductVariantOptions>;
  }

  /**
   * @description This method creates a new ProductVariantOption Record
   * @param createProductVariantOptionsDto
   */
  public async createProductVariantOptionsRecord(
    createProductVariantOptionsDto: CreateProductVariantOptionRecordDto
  ) {
    const { product, variantOptions, queryRunner } =
      createProductVariantOptionsDto;

    const productVariantOptions = new ProductVariantOptions();

    Object.assign(productVariantOptions, {
      product,
      variantOptions,
    });

    await queryRunner.manager.save(productVariantOptions);

    return productVariantOptions;
  }

  /**
   * @description This method gets a variantOption Record by productId
   */
  public async getProductVariantOptionsByProductId(productId: number) {
    const product = await this.productVariantOptionsRepository.findOneBy({
      isActive: true,
      isDeleted: false,
      productId,
    });

    return product || NULL_OBJECT;
  }

  public async getProductVariantOptionsById(productVariantOptionsId: number) {
    const productVariantOptions =
      await this.productVariantOptionsRepository.findOneBy({
        isActive: true,
        isDeleted: false,
        id: productVariantOptionsId,
      });

    return productVariantOptions || NULL_OBJECT;
  }

  public async getProductVariantOptionsByIdentifier(identifier: string) {
    const productVariantOptions =
      await this.productVariantOptionsRepository.findOneBy({
        isActive: true,
        isDeleted: false,
        identifier,
      });

    return productVariantOptions || NULL_OBJECT;
  }

  /**
   * @description This method updates a productVariantOptions Record
   * @param updateVariantOptionsRecordDto
   */
  public async updateProductVariantOptionsRecord(
    updateVariantOptionsRecordDto: UpdateProductVariantOptionsRecordDto
  ) {
    const { identifier, identifierType, updatePayload, queryRunner } =
      updateVariantOptionsRecordDto;

    let productVariant;

    switch (identifierType) {
      case "productId":
        productVariant = await this.getProductVariantOptionsByProductId(
          identifier as number
        );
        break;

      case "id":
        productVariant = await this.getProductVariantOptionsById(
          identifier as number
        );
        break;

      case "identifier":
        productVariant = await this.getProductVariantOptionsByIdentifier(
          identifier as string
        );
        break;
    }

    if (productVariant === NULL_OBJECT) return;

    Object.assign(productVariant, updatePayload);

    await queryRunner.manager.save(productVariant);

    return productVariant;
  }

  public async getProductVariantOptionsIdentifierFromProductId(
    productId: number
  ) {
    const productVariantOptions =
      await this.getProductVariantOptionsByProductId(productId);

    if (productVariantOptions === NULL_OBJECT)
      return {
        productVariantOptionsId: NULL_OBJECT,
        identifier: NULL_OBJECT,
      };

    return {
      productVariantOptionsId: productVariantOptions.id,
      identifier: productVariantOptions.identifier,
    };
  }

  public async resetProductVariantOptions(productVariantId: number) {
    return productVariantId;
  }

  public async isCombinationInVariantOption(
    isCombinationInVariantOptionDto: IsCombinationInVariantOptionDto
  ): Promise<boolean> {
    const { identifier, identifierType, combination } =
      isCombinationInVariantOptionDto;

    let productVariantOptions;

    switch (identifierType) {
      case "productId":
        productVariantOptions = await this.getProductVariantOptionsByProductId(
          identifier as number
        );
        break;

      case "id":
        productVariantOptions = await this.getProductVariantOptionsById(
          identifier as number
        );
        break;

      case "identifier":
        productVariantOptions = await this.getProductVariantOptionsByIdentifier(
          identifier as string
        );
        break;
    }
    if (productVariantOptions === NULL_OBJECT) return false;

    const variantOptionsCombinations =
      productVariantOptions.variantCombinations;

    if (!variantOptionsCombinations) return false;

    // Search for array in an array of arrays.
    // Reference https://stackoverflow.com/questions/19543514/check-whether-an-array-exists-in-an-array-of-arrays
    let i, j, current;

    for (i = 0; i < variantOptionsCombinations.length; ++i) {
      if (combination.length === variantOptionsCombinations[i].length) {
        current = variantOptionsCombinations[i];
        for (
          j = 0;
          j < combination.length && combination[j] === current[j];
          ++j
        );
        if (j === combination.length) return true;
      }
    }
    return false;
  }
}

export default new ProductVariantOptionsService();
