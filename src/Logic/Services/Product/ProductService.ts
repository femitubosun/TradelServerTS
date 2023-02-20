import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { Product } from "Entities/Product/Product";

@autoInjectable()
class ProductService {
  private productsRepository: any;

  constructor(private dbContext?: DbContext) {
    this.productsRepository = dbContext?.getEntityRepository(Product);
  }

  public async createProductRecord() {}

  public async getProductById() {}

  public async getProductByIdentifier() {}

  public async listProductByMerchantId() {}

  public async listActiveProduct() {}

  public async listDisabledProduct() {}

  public async updateProductRecord() {}

  public async deleteProductRecord() {}
}
