import { CreateCartRecordDto } from "TypeChecking/Cart";
import { Cart } from "Api/Modules/Client/Inventory/Entities";
import CartService from "Api/Modules/Client/Inventory/Services/CartService";
import ProductVariantService from "Api/Modules/Client/Inventory/Services/ProductVariantService";
import ProductService from "Api/Modules/Client/Inventory/Services/ProductService";
import { DepleteProductDto } from "Api/Modules/Client/Inventory/TypeChecking/Product/DepleteProductDto";
import { DepleteProductVariantDto } from "Api/Modules/Client/Inventory/TypeChecking/ProductVariant/DepleteProductVariantDto";

export class InventoryInternalApi {
  public static async createCartRecord(
    createCartRecordDto: CreateCartRecordDto
  ): Promise<Cart | null> {
    return await CartService.createCartRecord(createCartRecordDto);
  }

  public static async getCartByCustomerId(customerId: number) {
    return await CartService.getCartByCustomerId(customerId);
  }

  public static async getProductVariantById(productVariantId: number) {
    return await ProductVariantService.getProductVariantById(productVariantId);
  }

  public static async getProductById(productId: number) {
    return await ProductService.getProductById(productId);
  }

  public static async depleteProduct(depleteProductDto: DepleteProductDto) {
    return await ProductService.depleteProduct(depleteProductDto);
  }

  public static async depleteProductVariant(
    depleteProductVariantDto: DepleteProductVariantDto
  ) {
    return await ProductVariantService.depleteProductVariant(
      depleteProductVariantDto
    );
  }
}
