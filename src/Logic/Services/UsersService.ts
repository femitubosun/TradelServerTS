import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { User } from "Entities/User";
import { FAILURE, NULL_OBJECT, SUCCESS } from "Helpers/Messages/SystemMessages";
import {
  CreateUserRecordDto,
  IUser,
  UpdateUserRecordArgs,
} from "TypeChecking/Users";
import { LoggingProviderFactory } from "Lib/Infra/Internal/Logging";
import { DateTime } from "luxon";
import { ChangePasswordDto } from "TypeChecking/Users/ChangePasswordDto";

@autoInjectable()
class UsersService {
  private userRepository: any;

  constructor(private dbContext?: DbContext) {
    this.userRepository = dbContext?.getEntityRepository(User);
  }

  public async createUserRecord(createUserRecordArgs: CreateUserRecordDto) {
    const { email, firstName, lastName, password, roleId, queryRunner } =
      createUserRecordArgs;
    const newUserData = {
      email,
      firstName,
      lastName,
      password,
      roleId,
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

    return user || NULL_OBJECT;
  }

  public async getUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({
      email,
    });
    return user || NULL_OBJECT;
  }

  public async getUserById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOneBy({
      id,
    });
    return user || NULL_OBJECT;
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

  public async changeUserPassword(changePasswordArgs: ChangePasswordDto) {
    const { identifierType, identifier, password, queryRunner } =
      changePasswordArgs;

    const user =
      identifierType == "id"
        ? await this.getUserById(identifier as number)
        : await this.getUserByIdentifier(identifier as string);

    Object.assign(user, {
      password,
    });
    await queryRunner.manager.save(user);
    return SUCCESS;
  }

  public async updateUserRecord(
    updateUserRecordArgs: UpdateUserRecordArgs
  ): Promise<string> {
    const { identifierType, identifier, updateUserRecordPayload } =
      updateUserRecordArgs;
    const user =
      identifierType == "id"
        ? await this.getUserById(identifier as number)
        : await this.getUserByIdentifier(identifier as string);

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

  public async updateUserLastLoginDate(userId: number) {
    const updateUserRecordArgs: UpdateUserRecordArgs = {
      identifier: userId,
      identifierType: "id",
      updateUserRecordPayload: {
        lastLoginDate: DateTime.now(),
      },
    };
    return await this.updateUserRecord(updateUserRecordArgs);
  }
}

export default new UsersService();
