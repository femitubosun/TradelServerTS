import { CreateUserOptions, IUser, UpdateUserRecordOptions } from "./Options";
import { autoInjectable } from "tsyringe";
import { DBContext } from "Lib/Infra/Internal/DBContext";
import { Users } from "Domain/Entities/Users";

@autoInjectable()
class UsersService {
  private userRepo: any;

  constructor(private dbContext?: DBContext) {
    this.userRepo = dbContext?.getEntityRepository(Users);
  }

  public async createUserRecord(createUserOptions: CreateUserOptions) {
    const user = new Users();
    user.email = createUserOptions.email;
    user.firstName = createUserOptions.firstName;
    user.lastName = createUserOptions.lastName;
    user.password = createUserOptions.password;
    user.role = createUserOptions.role;
    await this.userRepo.save(user);
    return;
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
    updateUserRecordOptions: UpdateUserRecordOptions
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
