import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { User } from "Api/Modules/Client/OnboardingAndAuthentication/Entities/User";
import {
  NULL_OBJECT,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { DateTime } from "luxon";
import { Repository } from "typeorm";
import {
  CreateUserRecordDto,
  UpdateUserRecordArgs,
} from "Api/Modules/Client/OnboardingAndAuthentication/TypeChecking/Users";
import { ChangePasswordDto } from "Api/Modules/Client/OnboardingAndAuthentication/TypeChecking/Users/ChangePasswordDto";

@autoInjectable()
class UsersService {
  private userRepository;

  constructor(private dbContext?: DbContext) {
    this.userRepository = dbContext?.getEntityRepository(
      User
    ) as Repository<User>;
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

  public async listActiveUserRecord(): Promise<Iterable<User>> {
    return await this.userRepository.findBy({
      isActive: true,
    });
  }

  public async getUserByIdentifier(identifier: string): Promise<User | null> {
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

    if (user == NULL_OBJECT) return;

    Object.assign(user, {
      password,
    });
    await queryRunner.manager.save(user);
    return SUCCESS;
  }

  public async updateUserRecord(updateUserRecordArgs: UpdateUserRecordArgs) {
    const { identifierType, identifier, updateUserRecordPayload } =
      updateUserRecordArgs;

    const user =
      identifierType == "id"
        ? await this.getUserById(identifier as number)
        : await this.getUserByIdentifier(identifier as string);

    if (user == NULL_OBJECT) return NULL_OBJECT;

    Object.assign(user, updateUserRecordPayload);

    await this.userRepository.save(user);
    return user;
  }

  public async disableUserRecord(id: number) {
    const user = await this.getUserById(id);

    if (user == NULL_OBJECT) return;

    user.isDeleted = true;
    user.isActive = false;

    await this.userRepository.save(user);
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
