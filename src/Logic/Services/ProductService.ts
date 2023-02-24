import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { Product } from "Entities/Product";
import { Repository } from "typeorm";

@autoInjectable()
class ProductService {
  private productsRepository;

  constructor(private dbContext?: DbContext) {
    this.productsRepository = dbContext?.getEntityRepository(
      Product
    ) as Repository<Product>;
  }

  public async createProductRecord() {
    throw new Error("Method not implemented");
  }

  public async getProductById() {
    throw new Error("Method not implemented");
  }

  public async getProductByIdentifier() {
    throw new Error("Method not implemented");
  }

  public async listProductByMerchantId() {
    throw new Error("Method not implemented");
  }

  public async listActiveProduct() {
    throw new Error("Method not implemented");
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
