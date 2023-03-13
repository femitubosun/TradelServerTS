import { CreateCartRecordDto } from "TypeChecking/Cart";
import { Cart } from "Api/Modules/Client/Inventory/Entities";
import c from "config";

export class InventoryInternalApi {
  public static async createCartRecord(
    createCartRecordDto: CreateCartRecordDto
  ): Promise<Cart | null> {
    const { customerId, queryRunner } = createCartRecordDto;

    const cart = new Cart();
    cart.customerId = customerId;

    await queryRunner.manager.save(cart);
    return cart;
  }
}
