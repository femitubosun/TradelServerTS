import { autoInjectable } from "tsyringe";
import { DBContext } from "Lib/Infra/Internal/DBContext";
import { Customers } from "Entities/Customers";
import { CreateCustomerArgs } from "Logic/Services/Customers/TypeChecking/CreateCustomerArgs";
import { NULL_OBJECT } from "Utils/Messages";

@autoInjectable()
class CustomersService {
  private customersRepository: any;

  constructor(private dbContext?: DBContext) {
    this.customersRepository = dbContext?.getEntityRepository(Customers);
  }

  //TODO Add A Database Transaction to This
  public async createCustomerRecord(createCustomerArgs: CreateCustomerArgs) {
    const { user, queryRunner } = createCustomerArgs;
    const foundCustomer = await this.findCustomerByUserId(user.id);

    if (foundCustomer) return NULL_OBJECT;

    const customer = new Customers();
    Object.assign(customer, {
      user,
    });

    await queryRunner.manager.save(customer);
  }

  public async findCustomerByUserId(userId: any) {
    return await this.customersRepository.findOneBy({ userId });
  }
}

export default new CustomersService();
