import { autoInjectable } from "tsyringe";
import { DBContext } from "Lib/Infra/Internal/DBContext";
import { User } from "Entities/User";
import { DATABASE_ERROR, FAILURE, SUCCESS } from "Utils/Messages";
import { TypeOrmError } from "Exceptions/index";
import {
  CreateUserRecordArgs,
  IUser,
  UpdateUserRecordArgs,
} from "Logic/Services/Users/TypeSetting";
import { LoggingProviderFactory } from "Lib/Infra/Internal/Logging";

@autoInjectable()
class UsersService {
  private userRepository: any;

  constructor(private dbContext?: DBContext) {
    this.userRepository = dbContext?.getEntityRepository(User);
  }

  public async createUserRecord(createUserRecordArgs: CreateUserRecordArgs) {
    const { email, firstName, lastName, password, role, queryRunner } =
      createUserRecordArgs;
    const newUserData = {
      email,
      firstName,
      lastName,
      password,
      role,
    };

    const user = new User();
    Object.assign(user, newUserData);

    await queryRunner.manager.save(user);

    return user;
  }

  public async listActiveUserRecord(): Promise<Iterable<IUser>> {
    return await this.userRepository.findBy({
      active: true,
    });
  }

  public async findUserByIdentifier(identifier: string): Promise<any> {
    return await this.userRepository.findOneBy({
      identifier,
    });
  }

  public async findUserByEmail(email: string) {
    return await this.userRepository.findOneBy({
      email,
    });
  }

  public async findUserById(id: number): Promise<IUser | null> {
    return await this.userRepository.findOneBy({
      id,
    });
  }

  public async activateUserEmail(id: number) {
    const updateUserRecordArgs: UpdateUserRecordArgs = {
      identifierType: "id",
      identifier: id,
      updateUserRecordPayload: {
        hasVerifiedEmail: true,
      },
    };
    return await this.updateUserRecord(updateUserRecordArgs);
  }

  public async updateUserRecord(
    updateUserRecordArgs: UpdateUserRecordArgs
  ): Promise<string> {
    const { identifierType, identifier, updateUserRecordPayload } =
      updateUserRecordArgs;
    const user =
      identifierType == "id"
        ? await this.userRepository.findUserById(identifier as number)
        : await this.userRepository.findOneBy({ identifier });

    Object.assign(user, updateUserRecordPayload);
    try {
      await this.userRepository.save(user);
      return SUCCESS;
    } catch (e) {
      const logger = LoggingProviderFactory.build();
      console.log(e);
      logger.error(e);
      return FAILURE;
    }
  }

  public async disableUserRecord(id: number): Promise<any> {
    const user = (await this.findUserById(id))!;
    user.isDeleted = true;
    user.isActive = false;
    this.userRepository.save(user);
  }
}

export default new UsersService();
