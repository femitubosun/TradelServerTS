import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { CartItem } from "Api/Modules/Client/Inventory/Entities";
import { Repository } from "typeorm";
import { CreateCartItemRecordDto } from "Api/Modules/Client/Inventory/TypeChecking/CartItem/CreateCartItemRecordDto";
import { NULL_OBJECT } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { UpdateCartItemRecordDto } from "Api/Modules/Client/Inventory/TypeChecking/CartItem/UpdateCartItemRecordDto";

@autoInjectable()
class CartItemService {
  private cartItemsRepository;

  constructor(private dbContext?: DbContext) {
    this.cartItemsRepository = dbContext?.getEntityRepository(
      CartItem
    ) as Repository<CartItem>;
  }

  public async createCartItemRecord(
    createCartItemDto: CreateCartItemRecordDto
  ) {
    const { queryRunner, cartId, productId, quantity } = createCartItemDto;

    const cartItem = new CartItem();

    Object.assign(cartItem, {
      cartId,
      productId,
      quantity,
    });

    await queryRunner.manager.save(cartItem);

    return cartItem;
  }

  public async listCartItemsByCartId(cartId: number) {
    return await this.cartItemsRepository.find({
      where: {
        cartId,
      },
    });
  }

  public async getCartItemByIdentifier(identifier: string) {
    const cartItem = await this.cartItemsRepository.findOneBy({
      identifier,
    });

    return cartItem || NULL_OBJECT;
  }

  public async getCartItemById(id: number) {
    const cartItem = await this.cartItemsRepository.findOneBy({
      id,
    });

    return cartItem || NULL_OBJECT;
  }

  public async updateCartItem(updateCartItemDto: UpdateCartItemRecordDto) {
    const { identifierType, identifier, updatePayload, queryRunner } =
      updateCartItemDto;

    const cartItem =
      identifierType === "id"
        ? await this.getCartItemById(identifier as number)
        : await this.getCartItemByIdentifier(identifier as string);

    if (cartItem === NULL_OBJECT) return;

    Object.assign(cartItem, updatePayload);

    await queryRunner.manager.save(cartItem);

    return cartItem;
  }
}

export default new CartItemService();
