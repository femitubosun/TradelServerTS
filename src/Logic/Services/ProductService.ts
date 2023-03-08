import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { Product } from "Entities/Product";
import { Repository } from "typeorm";
import { NULL_OBJECT } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { CreateProductRecordDtoType } from "TypeChecking/Product/CreateProductRecordDtoType";

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
    const productInfo = await this.productsRepository.findOneById(productId);
    return productInfo || NULL_OBJECT;
  }

  public async getProductByIdentifier(
    productIdentifier: string
  ): Promise<Product | null> {
    const productInfo = this.productsRepository.findOneBy({
      identifier: productIdentifier,
    });

    return productInfo || NULL_OBJECT;
  }

  public async getProductBySlug(productSlug: string) {
    const productInfo = this.productsRepository.findOneBy({
      nameSlug: productSlug,
    });

    return productInfo || NULL_OBJECT;
  }

  public async listActiveProductsByMerchantId(merchantId: number) {
    return await this.productsRepository.findBy({
      isActive: true,
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

  public async updateProductRecord() {
    throw new Error("Method not implemented");
  }

  public async deleteProductRecord() {
    throw new Error("Method not implemented");
  }
}

export default new ProductService();
