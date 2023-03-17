import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { Cart } from "Api/Modules/Client/Inventory/Entities/Cart";
import { NULL_OBJECT } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { CreateCartRecordDto } from "TypeChecking/Cart";
import { Repository } from "typeorm";
import { UpdateCartRecordDto } from "Api/Modules/Client/Inventory/TypeChecking/Cart/UpdateCartRecordDto";

@autoInjectable()
class CartService {
  private cartRepository: Repository<Cart>;

  constructor(private dbContext?: DbContext) {
    this.cartRepository = dbContext?.getEntityRepository(
      Cart
    ) as Repository<Cart>;
  }

  /**
   * @description This method creates a new cart record
   * @param {CreateCartRecordDto} createCartRecordDto
   * @return Promise<Cart|null>
   * @author Femi Ayo-Tubosun, E.
   */
  public async createCartRecord(
    createCartRecordDto: CreateCartRecordDto
  ): Promise<Cart | null> {
    const { customerId, queryRunner } = createCartRecordDto;

    const foundCart = await this.getCartByCustomerId(customerId);

    if (foundCart) return NULL_OBJECT;

    const cart = new Cart();
    cart.customerId = customerId;

    await queryRunner.manager.save(cart);
    return cart;
  }

  public async getCartById(cartId: number) {
    const cartsList = await this.cartRepository.find({
      where: {
        id: cartId,
      },
      relations: {
        items: true,
      },
      take: 1,
    });

    const cart = cartsList[0];

    return cart || NULL_OBJECT;
  }

  public async getCartByCustomerId(customerId: number) {
    const cartsList = await this.cartRepository.find({
      where: {
        customerId,
      },
      relations: {
        items: true,
      },
      take: 1,
    });

    const cart = cartsList[0];

    return cart || NULL_OBJECT;
  }

  public async getCartByIdentifier(identifier: string) {
    const cartsList = await this.cartRepository.find({
      where: {
        identifier,
      },
      relations: {
        items: true,
      },
      take: 1,
    });

    const cart = cartsList[0];

    return cart || NULL_OBJECT;
  }

  public async updateCartRecord(updateCartRecordDto: UpdateCartRecordDto) {
    const { identifierType, identifier, updatePayload, queryRunner } =
      updateCartRecordDto;

    const cart =
      identifierType === "id"
        ? await this.getCartById(identifier as number)
        : await this.getCartByIdentifier(identifier as string);

    if (cart == NULL_OBJECT) return;

    Object.assign(cart, updatePayload);

    await queryRunner.manager.save(cart);

    return cart;
  }
}

export default new CartService();
