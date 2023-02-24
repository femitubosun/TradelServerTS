import { autoInjectable } from "tsyringe";
import { UserTokens } from "Entities/UserTokens";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { FAILURE, NULL_OBJECT, SUCCESS } from "Helpers/Messages/SystemMessages";
import {
  CreateEmailActivationTokenArgs,
  CreateUserTokenArgs,
  UpdateUserTokenRecordArgs,
  UserTokenTypesEnum,
} from "TypeChecking/UserTokens";
import { generateToken } from "Utils/generateToken";
import { DateTime } from "luxon";
import { businessConfig } from "Config/businessConfig";
import { ListUserTokenForUserByTokenTypeArgs } from "TypeChecking/UserTokens/ListUserTokenForUserByTokenTypeArgs";
import { CreatePasswordRecoveryTokenArgs } from "TypeChecking/UserTokens/CreatePasswordRecoveryTokenArgs";
import { Repository } from "typeorm";

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
  public async createUserTokenRecord(createUserTokenArgs: CreateUserTokenArgs) {
    const { queryRunner } = createUserTokenArgs;
    const userToken = new UserTokens();
    let generatedToken = generateToken(businessConfig.userTokenLength);
    let foundToken = await this.getUserTokenByToken(generatedToken);

    while (foundToken) {
      generatedToken = generateToken(businessConfig.userTokenLength);
      foundToken = await this.getUserTokenByToken(generatedToken);
    }

    Object.assign(userToken, {
      ...createUserTokenArgs,
      token: generatedToken,
    });
    await queryRunner.manager.save(userToken);
    return userToken;
  }

  public async createEmailActivationToken(
    createEmailActivationTokenArgs: CreateEmailActivationTokenArgs
  ) {
    const { userId, queryRunner } = createEmailActivationTokenArgs;
    const expiresOn = DateTime.now().plus({
      minute: businessConfig.emailTokenExpiresInMinutes,
    });
    const createUserTokenArgs: CreateUserTokenArgs = {
      userId,
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
    createPasswordRecoveryTokenArgs: CreatePasswordRecoveryTokenArgs
  ) {
    const { userId, queryRunner } = createPasswordRecoveryTokenArgs;
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

    const createUserTokenArgs: CreateUserTokenArgs = {
      userId,
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
    listUserTokenForUserByTokenTypeArgs: ListUserTokenForUserByTokenTypeArgs
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
    const updateUserTokenRecordArgs: UpdateUserTokenRecordArgs = {
      identifierType: "id",
      identifier: tokenId,
      updatePayload: {
        expired: true,
      },
    };

    return await this.updateUserTokenRecord(updateUserTokenRecordArgs);
  }

  public async updateUserTokenRecord(
    updateUserTokenRecordArgs: UpdateUserTokenRecordArgs
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
}

export default new UserTokensService();
