import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { Cart } from "Entities/Cart";
import { NULL_OBJECT } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { CreateCartRecordDto } from "TypeChecking/Cart";
import { Repository } from "typeorm";

@autoInjectable()
export class CartService {
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

    const foundCart = await this.findCartByCustomerId(customerId);

    if (foundCart) return NULL_OBJECT;

    const cart = new Cart();
    cart.customerId = customerId;

    await queryRunner.manager.save(cart);
    return cart;
  }

  public async findCartByCustomerId(customerId: number) {
    return await this.cartRepository.findOneBy({ customerId });
  }
}

export default new CartService();
