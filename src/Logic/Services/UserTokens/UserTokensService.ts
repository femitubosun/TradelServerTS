import { autoInjectable } from "tsyringe";

import { UserTokens, UserTokenTypesEnum } from "Entities/UserTokens";
import { DBContext } from "Lib/Infra/Internal/DBContext";
import { FAILURE, SUCCESS } from "Utils/Messages";
import {
  CreateUserTokenArgs,
  UpdateUserTokenRecordArgs,
} from "Logic/Services/UserTokens/TypeChecking";
import { generateToken } from "Utils/generateToken";
import { domainConfig } from "Config/domainConfig";
import { User } from "Entities/User";
import { DateTime } from "luxon";
import { appConfig } from "Config/appConfig";
import { LoggingProviderFactory } from "Lib/Infra/Internal/Logging";

@autoInjectable()
class UserTokensService {
  private userTokenRepository: any;

  constructor(private dbContext?: DBContext) {
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
    const userToken = new UserTokens();
    let generatedToken = generateToken(appConfig.userTokenLength);
    let foundToken = await this.findUserTokenByToken(generatedToken);

    while (foundToken) {
      generatedToken = generateToken(appConfig.userTokenLength);
      foundToken = await this.findUserTokenByToken(generatedToken);
    }

    Object.assign(userToken, {
      ...createUserTokenArgs,
      token: generatedToken,
    });
    await this.userTokenRepository.save(userToken);

    return userToken;
  }

  public async createEmailActivationToken(user: User) {
    const expiresOn = DateTime.now().plus({
      minute: appConfig.emailTokenExpiresInMinutes,
    });
    const createUserTokenArgs: CreateUserTokenArgs = {
      user,
      type: UserTokenTypesEnum.EMAIL,
      expiresOn,
    };
    return await this.createUserTokenRecord(createUserTokenArgs);
  }

  public async findUserTokenByToken(token: string): Promise<UserTokens | null> {
    return await this.userTokenRepository.findOneBy({
      token,
    });
  }

  public async findUserTokenById(id: number) {
    return await this.userTokenRepository.findOneById(id);
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
