import { autoInjectable } from "tsyringe";
import { DBContext } from "Lib/Infra/Internal/DBContext";
import { User } from "Entities/User";
import { FAILURE, NULL_OBJECT, SUCCESS } from "Utils/Messages";
import {
  CreateUserRecordArgs,
  IUser,
  UpdateUserRecordArgs,
} from "Logic/Services/Users/TypeChecking";
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

  public async getUserByIdentifier(identifier: string): Promise<any> {
    const user = await this.userRepository.findOneBy({
      identifier,
    });

    if (!user) return NULL_OBJECT;
    return user;
  }

  public async getUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({
      email,
    });
    if (!user) return NULL_OBJECT;
    return user;
  }

  public async getUserById(id: number): Promise<IUser | null> {
    const user = await this.userRepository.findOneBy({
      id,
    });

    if (!user) return NULL_OBJECT;
    return user;
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
    const user = (await this.getUserById(id))!;
    user.isDeleted = true;
    user.isActive = false;
    this.userRepository.save(user);
  }
}

export default new UsersService();
