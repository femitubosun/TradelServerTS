import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { ProductVariant } from "Api/Modules/Client/Inventory/Entities";
import { Repository } from "typeorm";
import { CreateProductVariantDto } from "Api/Modules/Client/Inventory/TypeChecking/ProductVariant/CreateProductVariantDto";
import { NULL_OBJECT } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { UpdateProductVariantDto } from "Api/Modules/Client/Inventory/TypeChecking/ProductVariant/UpdateProductVariantDto";
import { DepleteProductVariantDto } from "Api/Modules/Client/Inventory/TypeChecking/ProductVariant/DepleteProductVariantDto";

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
    const { sku, price, stock, product, parentVariants, queryRunner } =
      createProductVariantRecordDto;

    const productVariant = new ProductVariant();

    Object.assign(productVariant, {
      sku,
      price,
      stock,
      product,
      parentVariants,
    });

    await queryRunner.manager.save(productVariant);

    return productVariant;
  }

  public async getProductVariantByIdentifier(identifier: string) {
    const productVariant = await this.productVariantsRepository.findOne({
      where: {
        identifier,
        isActive: true,
        isDeleted: false,
      },
      relations: {
        product: true,
      },
    });

    return productVariant || NULL_OBJECT;
  }

  public async getProductVariantById(productVariantId: number) {
    const productVariant = await this.productVariantsRepository.findOne({
      where: {
        id: productVariantId,
        isActive: true,
        isDeleted: false,
      },
      relations: {
        product: true,
      },
    });

    return productVariant || NULL_OBJECT;
  }

  public async listProductVariantsByProductId(productId: number) {
    return await this.productVariantsRepository.findBy({
      productId,
    });
  }

  public async deleteProductVariant(productVariantId: number) {
    return await this.productVariantsRepository.delete(productVariantId);
  }

  public async updateProductVariant(
    updateProductVariantDto: UpdateProductVariantDto
  ) {
    const { identifier, identifierType, updatePayload, queryRunner } =
      updateProductVariantDto;

    const productVariant =
      identifierType === "id"
        ? await this.getProductVariantById(identifier as number)
        : await this.getProductVariantByIdentifier(identifier as string);

    if (productVariant == NULL_OBJECT) return;

    Object.assign(productVariant, updatePayload);

    await queryRunner.manager.save(productVariant);

    return productVariant;
  }

  public async depleteProductVariant(
    depleteProductVariantDto: DepleteProductVariantDto
  ) {
    const { productVariantId, quantity, queryRunner } =
      depleteProductVariantDto;

    const productVariant = await this.getProductVariantById(productVariantId);

    const newStock = productVariant!.stock - quantity;

    return await this.updateProductVariant({
      identifier: productVariantId,
      identifierType: "id",
      updatePayload: {
        stock: newStock,
      },
      queryRunner,
    });
  }
}

export default new ProductVariantService();
