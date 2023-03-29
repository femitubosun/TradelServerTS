import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { Customer } from "Api/Modules/Client/Profile/Entities/Customer";
import { CreateCustomerRecordDtoType } from "Api/Modules/Client/Profile/TypeChecking/Customer/CreateCustomerRecordDtoType";
import { Repository } from "typeorm";
import { NULL_OBJECT } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { GetCustomerUserIdDto } from "Api/Modules/Client/Profile/TypeChecking/GeneralPurpose/GetCustomerUserIdDto";

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

  public async getCustomerById(customerId: number) {
    const customer = await this.customersRepository.findOneBy({
      id: customerId,
    });

    return customer || NULL_OBJECT;
  }

  public async getCustomerByIdentifier(identifier: string) {
    const customer = await this.customersRepository.findOneBy({
      identifier,
    });

    return customer || NULL_OBJECT;
  }

  public async getCustomerUserId(getCustomerUserIdDto: GetCustomerUserIdDto) {
    const { identifier, identifierType } = getCustomerUserIdDto;

    const customer =
      identifierType === "id"
        ? await this.getCustomerById(Number(identifier))
        : await this.getCustomerByIdentifier(String(identifier));

    if (customer === NULL_OBJECT) return -1;

    return customer.userId;
  }
}

export default new CustomerService();
