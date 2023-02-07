import { autoInjectable } from "tsyringe";
import { DBContext } from "Lib/Infra/Internal/DBContext";
import { User } from "Entities/User";
import { DATABASE_ERROR } from "Utils/Messages";
import { TypeOrmError } from "Exceptions/index";
import {
  CreateUserRecordArgs,
  IUser,
  UpdateUserRecordDTO,
} from "Logic/Services/Users/TypeSetting";

@autoInjectable()
class UsersService {
  private userRepo: any;

  constructor(private dbContext?: DBContext) {
    this.userRepo = dbContext?.getEntityRepository(User);
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
    return await this.userRepo.findBy({
      active: true,
    });
  }

  public async findUserByIdentifier(identifier: string): Promise<any> {
    return await this.userRepo.findOneBy({
      identifier,
    });
  }

  public async findUserByEmail(email: string) {
    return await this.userRepo.findOneBy({
      email,
    });
  }

  public async findUserById(id: number): Promise<IUser | null> {
    return await this.userRepo.findOneBy({
      id,
    });
  }

  public async updateUserRecord(
    id: number,
    updateUserRecordOptions: UpdateUserRecordDTO
  ): Promise<boolean> {
    return await this.userRepo.findOneAndUpdate(id, updateUserRecordOptions);
  }

  public async disableUserRecord(id: number): Promise<any> {
    const user = (await this.findUserById(id))!;
    user.isDeleted = true;
    user.isActive = false;
    this.userRepo.save(user);
  }
}

export default new UsersService();
