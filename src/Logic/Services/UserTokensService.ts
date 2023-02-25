import { autoInjectable } from "tsyringe";
import { UserTokens } from "Entities/UserTokens";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { FAILURE, NULL_OBJECT, SUCCESS } from "Helpers/Messages/SystemMessages";
import {
  CreateEmailActivationTokenDtoType,
  CreateUserTokenDtoType,
  UpdateUserTokenRecordDtoType,
  UserTokenTypesEnum,
} from "TypeChecking/UserTokens";
import { DateTime } from "luxon";
import { businessConfig } from "Config/businessConfig";
import { ListUserTokenForUserByTokenDtoType } from "TypeChecking/UserTokens/ListUserTokenForUserByTokenDtoType";
import { CreatePasswordRecoveryTokenDtoType } from "TypeChecking/UserTokens/CreatePasswordRecoveryTokenDtoType";
import { Repository } from "typeorm";
import { FetchActiveUserTokenRecordDtoType } from "TypeChecking/UserTokens/FetchActiveUserTokenRecordDtoType";

@autoInjectable()
class UserTokensService {
  private userTokenRepository;

  constructor(private dbContext?: DbContext) {
    this.userTokenRepository = dbContext?.getEntityRepository(
      UserTokens
    ) as Repository<UserTokens>;
  }

  /*
   * This method creates a new UserToken Record
   *
   * @args
   * - createUserTokenArgs: CreateUserTokenArgs
   *
   * returns UserToken
   */
  public async createUserTokenRecord(
    createUserTokenArgs: CreateUserTokenDtoType
  ) {
    const { queryRunner } = createUserTokenArgs;
    const userToken = new UserTokens();

    Object.assign(userToken, {
      ...createUserTokenArgs,
    });
    await queryRunner.manager.save(userToken);
    return userToken;
  }

  public async createEmailActivationToken(
    createEmailActivationTokenArgs: CreateEmailActivationTokenDtoType
  ) {
    const { userId, queryRunner, token } = createEmailActivationTokenArgs;
    const expiresOn = DateTime.now().plus({
      minute: businessConfig.emailTokenExpiresInMinutes,
    });
    const createUserTokenArgs: CreateUserTokenDtoType = {
      userId,
      token,
      tokenType: UserTokenTypesEnum.EMAIL,
      expiresOn,
      queryRunner,
    };
    return await this.createUserTokenRecord(createUserTokenArgs);
  }

  public async getUserTokenByToken(token: string): Promise<UserTokens | null> {
    return await this.userTokenRepository.findOneBy({
      token,
    });
  }

  public async createPasswordRecoveryToken(
    createPasswordRecoveryTokenArgs: CreatePasswordRecoveryTokenDtoType
  ) {
    const { userId, queryRunner, token } = createPasswordRecoveryTokenArgs;
    const userTokens = await this.listUserTokenForUserByTokenType({
      userId,
      tokenType: UserTokenTypesEnum.PASSWORD_RESET,
    });

    for (const token of userTokens) {
      await this.deactivateUserToken(token.id);
    }

    const expiresOn = DateTime.now().plus({
      minute: businessConfig.passwordResetTokenExpiresInMinutes,
    });

    const createUserTokenArgs: CreateUserTokenDtoType = {
      userId,
      token,
      tokenType: UserTokenTypesEnum.PASSWORD_RESET,
      expiresOn,
      queryRunner,
    };

    return await this.createUserTokenRecord(createUserTokenArgs);
  }

  public async getUserTokenById(id: number) {
    return await this.userTokenRepository.findOneById(id);
  }

  public async listUserTokenForUserByTokenType(
    listUserTokenForUserByTokenTypeArgs: ListUserTokenForUserByTokenDtoType
  ) {
    return await this.userTokenRepository.findBy(
      listUserTokenForUserByTokenTypeArgs
    );
  }

  public async getUserTokenByIdentifier(tokenIdentifier: string) {
    return await this.userTokenRepository.findOneBy({
      identifier: tokenIdentifier,
    });
  }

  public async deactivateUserToken(tokenId: number) {
    const updateUserTokenRecordArgs: UpdateUserTokenRecordDtoType = {
      identifierType: "id",
      identifier: tokenId,
      updatePayload: {
        expired: true,
        isActive: false,
      },
    };

    return await this.updateUserTokenRecord(updateUserTokenRecordArgs);
  }

  public async fetchActiveUserTokenRecord(
    fetchActiveUserTokenRecordDto: FetchActiveUserTokenRecordDtoType
  ) {
    return this.userTokenRepository.findOneBy({
      ...fetchActiveUserTokenRecordDto,
      isActive: true,
      expired: false,
    });
  }

  public async updateUserTokenRecord(
    updateUserTokenRecordArgs: UpdateUserTokenRecordDtoType
  ) {
    const { identifier, identifierType, updatePayload } =
      updateUserTokenRecordArgs;

    const userToken =
      identifierType == "id"
        ? await this.userTokenRepository.findOneById(identifier as number)
        : await this.userTokenRepository.findOneBy({
            identifier: identifier as string,
          });

    if (userToken == NULL_OBJECT) return;

    Object.assign(userToken, updatePayload);

    try {
      await this.userTokenRepository.save(userToken);
      return SUCCESS;
    } catch (e) {
      console.log(e);
      return FAILURE;
    }
  }

  public getEmailTokenExpiresOn() {
    return DateTime.now().plus({
      minute: businessConfig.emailTokenExpiresInMinutes,
    });
  }
}

export default new UserTokensService();
