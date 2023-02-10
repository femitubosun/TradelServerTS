import { autoInjectable } from "tsyringe";
import { CreateUserTokenArgs } from "Logic/Services/UserTokens/TypeChecking/CreateUserTokenArgs";
import { UserTokens } from "Entities/UserTokens";
import { DBContext } from "Lib/Infra/Internal/DBContext";
import { SUCCESS } from "Utils/Messages";
import { UpdateUserTokenRecordArgs } from "Logic/Services/UserTokens/TypeChecking";
import { generateToken } from "Utils/generateToken";
import { domainConfig } from "Config/domainConfig";

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
    let generatedToken = generateToken(domainConfig.USER_TOKEN_LENGTH);
    let foundToken = await this.findUserTokenByToken(generatedToken);

    while (foundToken) {
      generatedToken = generateToken(domainConfig.USER_TOKEN_LENGTH);
      foundToken = await this.findUserTokenByToken(generatedToken);
    }

    Object.assign(userToken, {
      ...createUserTokenArgs,
      token: generatedToken,
    });
    await this.userTokenRepository.save(userToken);
    return userToken;
  }

  public async findUserTokenByToken(token: string) {
    return await this.userTokenRepository.findOneBy({
      token,
    });
  }

  public async findUserTokenById(id: number) {
    return await this.userTokenRepository.findOneById(id);
  }

  public async findUserTokenByIdentifier(identifier: string) {
    return await this.userTokenRepository.findOne({
      identifier,
    });
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
    await this.userTokenRepository.save(userToken);
    return SUCCESS;
  }
}

export default new UserTokensService();
