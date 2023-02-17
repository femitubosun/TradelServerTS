import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { Customer } from "Entities/Customer";
import { CreateCustomerArgs } from "Logic/Services/Customers/TypeChecking/CreateCustomerArgs";

@autoInjectable()
class CustomerService {
  private customersRepository: any;

  constructor(private dbContext?: DbContext) {
    this.customersRepository = dbContext?.getEntityRepository(Customer);
  }

  public async createCustomerRecord(createCustomerArgs: CreateCustomerArgs) {
    const { user, queryRunner, phoneNumber } = createCustomerArgs;
    const foundCustomer = await this.findCustomerByUserId(user.id);

    if (foundCustomer) return foundCustomer;

    const customer = new Customer();
    Object.assign(customer, {
      user,
      phoneNumber,
    });

    await queryRunner.manager.save(customer);

    return customer;
  }

  public async findCustomerByUserId(userId: any) {
    return await this.customersRepository.findOneBy({ userId });
  }
}

export default new CustomerService();
