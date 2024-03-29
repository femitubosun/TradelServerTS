import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { Product } from "Api/Modules/Client/Inventory/Entities/Product";
import { Repository } from "typeorm";
import { NULL_OBJECT } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { CreateProductRecordDtoType } from "Api/Modules/Client/Inventory/TypeChecking/Product/CreateProductRecordDtoType";
import { UpdateProductRecordDto } from "Api/Modules/Client/Inventory/TypeChecking/Product/UpdateProductRecordDto";
import { DeleteRecordDto } from "Api/Modules/Client/Inventory/TypeChecking/GeneralPurpose/DeleteRecordDto";
import { DepleteProductDto } from "Api/Modules/Client/Inventory/TypeChecking/Product/DepleteProductDto";
import { PaginationDto } from "Api/Modules/Common/TypeChecking/GeneralPurpose/PaginationDto";

@autoInjectable()
class ProductService {
  private productsRepository;

  constructor(private dbContext?: DbContext) {
    this.productsRepository = dbContext?.getEntityRepository(
      Product
    ) as Repository<Product>;
  }

  public async createProductRecord(
    createProductRecordDto: CreateProductRecordDtoType
  ) {
    const { queryRunner, name, description, basePrice, merchantId } =
      createProductRecordDto;

    const product = new Product();

    Object.assign(product, {
      name,
      description,
      basePrice,
      merchantId,
    });

    await queryRunner.manager.save(product);

    return product;
  }

  public async getProductById(productId: number): Promise<Product | null> {
    const product = await this.productsRepository.findOne({
      where: {
        id: productId,
      },
      relations: {
        variants: true,
      },
    });
    return product || NULL_OBJECT;
  }

  public async getProductByIdentifier(
    productIdentifier: string
  ): Promise<Product | null> {
    const product = await this.productsRepository.findOne({
      where: {
        identifier: productIdentifier,
        isActive: true,
        isDeleted: false,
      },
      relations: {
        variants: true,
      },
    });

    return product || NULL_OBJECT;
  }

  public async getProductBySlug(productSlug: string) {
    const product = await this.productsRepository.findOne({
      where: {
        nameSlug: productSlug,
      },
      relations: {
        variants: true,
      },
    });

    return product || NULL_OBJECT;
  }

  public async listActiveProductsByMerchantId(
    merchantId: number,
    paginationDto?: PaginationDto
  ) {
    return await this.productsRepository.findBy({
      isActive: true,
      merchantId,
    });
  }

  public async listProductsByMerchantId(merchantId: number) {
    return await this.productsRepository.findBy({
      merchantId,
    });
  }

  public async listActiveProducts(): Promise<Product[]> {
    return await this.productsRepository.findBy({
      isActive: true,
    });
  }

  public async listDisabledProduct() {
    throw new Error("Method not implemented");
  }

  public async updateProductRecord(updateProductDto: UpdateProductRecordDto) {
    const { identifier, identifierType, updatePayload, queryRunner } =
      updateProductDto;

    const product =
      identifierType === "id"
        ? await this.getProductById(identifier as number)
        : await this.getProductByIdentifier(identifier as string);

    if (product === NULL_OBJECT) return;

    Object.assign(product, updatePayload);

    await queryRunner.manager.save(product);

    return product;
  }

  public async deleteProductRecord(deleteProductDto: DeleteRecordDto) {
    const { identifier, identifierType, queryRunner } = deleteProductDto;

    const product =
      identifierType === "id"
        ? await this.getProductById(identifier as number)
        : await this.getProductByIdentifier(identifier as string);

    if (product === NULL_OBJECT) return;

    Object.assign(product, {
      isDeleted: true,
      isActive: false,
    });

    await queryRunner.manager.save(product);

    return product;
  }

  public async depleteProduct(depleteProductDto: DepleteProductDto) {
    const { productId, quantity, queryRunner } = depleteProductDto;

    const product = await this.getProductById(productId);

    const newStock = product!.stock - quantity;

    await this.updateProductRecord({
      identifier: productId,
      identifierType: "id",
      updatePayload: {
        stock: newStock,
      },
      queryRunner,
    });
  }

  public async searchProduct(searchQuery: string) {
    return this.productsRepository
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

export default new ProductService();
