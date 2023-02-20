import { autoInjectable } from "tsyringe";
import { UserTokens, UserTokenTypesEnum } from "Entities/UserTokens";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { FAILURE, SUCCESS } from "Helpers/Messages/SystemMessages";
import {
  CreateEmailActivationTokenArgs,
  CreateUserTokenArgs,
  UpdateUserTokenRecordArgs,
} from "Logic/Services/UserTokens/TypeChecking";
import { generateToken } from "Utils/generateToken";
import { DateTime } from "luxon";
import { businessConfig } from "Config/businessConfig";
import { LoggingProviderFactory } from "Lib/Infra/Internal/Logging";
import { ListUserTokenForUserByTokenTypeArgs } from "Logic/Services/UserTokens/TypeChecking/ListUserTokenForUserByTokenTypeArgs";

@autoInjectable()
class UserTokensService {
  private userTokenRepository: any;

  constructor(private dbContext?: DbContext) {
    this.userTokenRepository = dbContext?.getEntityRepository(UserTokens);
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
    let foundToken = await this.findUserTokenByToken(generatedToken);

    while (foundToken) {
      generatedToken = generateToken(businessConfig.userTokenLength);
      foundToken = await this.findUserTokenByToken(generatedToken);
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

  public async findUserTokenByToken(token: string): Promise<UserTokens | null> {
    return await this.userTokenRepository.findOneBy({
      token,
    });
  }

  public async createPasswordRecoveryToken() {}

  public async findUserTokenById(id: number) {
    return await this.userTokenRepository.findOneById(id);
  }

  public async listUserTokenForUserByTokenType(
    listUserTokenForUserByTokenTypeArgs: ListUserTokenForUserByTokenTypeArgs
  ) {
    return await this.userTokenRepository.find(
      listUserTokenForUserByTokenTypeArgs
    );
  }

  public async findUserTokenByIdentifier(tokenIdentifier: string) {
    return await this.userTokenRepository.findOne({
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
    const { identifier, updatePayload } = updateUserTokenRecordArgs;

    const userToken =
      identifier == "id"
        ? await this.userTokenRepository.findOneById(identifier)
        : await this.userTokenRepository.findOneBy({
            identifier,
          });

    Object.assign(userToken, updatePayload);

    try {
      await this.userTokenRepository.save(userToken);
      return SUCCESS;
    } catch (e) {
      const logger = LoggingProviderFactory.build();
      console.log(e);
      logger.error(e);
      return FAILURE;
    }
  }
}

export default new UserTokensService();
