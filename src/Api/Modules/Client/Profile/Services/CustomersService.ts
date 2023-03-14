import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { Customer } from "Api/Modules/Client/Profile/Entities/Customer";
import { CreateCustomerRecordDtoType } from "Api/Modules/Client/Profile/TypeChecking/Customer/CreateCustomerRecordDtoType";
import { Repository } from "typeorm";
import { NULL_OBJECT } from "Api/Modules/Common/Helpers/Messages/SystemMessages";

@autoInjectable()
class CustomerService {
  private customersRepository;

  constructor(private dbContext?: DbContext) {
    this.customersRepository = dbContext?.getEntityRepository(
      Customer
    ) as Repository<Customer>;
  }

  public async createCustomerRecord(
    createCustomerArgs: CreateCustomerRecordDtoType
  ) {
    const { userId, queryRunner, phoneNumber } = createCustomerArgs;
    const foundCustomer = await this.getCustomerByUserId(userId);

    if (foundCustomer) return foundCustomer;

    const customer = new Customer();

    Object.assign(customer, {
      userId,
      phoneNumber,
    });

    await queryRunner.manager.save(customer);

    return customer;
  }

  public async getCustomerByUserId(userId: number) {
    const customer = await this.customersRepository.findOneBy({ userId });

    return customer || NULL_OBJECT;
  }
}

export default new CustomerService();
