import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { Cart } from "Entities/Cart";
import { NULL_OBJECT } from "Helpers/Messages/SystemMessages";
import { CreateCartRecordDto } from "TypeChecking/Cart";

@autoInjectable()
export class CartService {
  private cartRepository: any;

  constructor(private dbContext?: DbContext) {
    this.cartRepository = dbContext?.getEntityRepository(Cart);
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
    const { customer, queryRunner } = createCartRecordDto;

    const foundCart = await this.findCartByCustomerId(customer.id);

    if (foundCart) return NULL_OBJECT;

    const cart = new Cart();
    cart.customer = customer;

    await queryRunner.manager.save(cart);
    return cart;
  }

  public async findCartByCustomerId(customerId: number) {
    return await this.cartRepository.findOneBy({ customerId });
  }
}

export default new CartService();
