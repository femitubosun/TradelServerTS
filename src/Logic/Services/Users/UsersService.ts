import { CreateUserOptions, IUser } from "./Options";
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
    return [];
  }

  public async findUserByIdentifier(identifier: string): Promise<any> {}

  public async findUserByEmail(email: string) {
    return await this.userRepo.findOneBy({
      email,
    });
  }

  public async findUserById(id: number): Promise<any> {}

  public async updateUserRecord(id: number): Promise<any> {}

  public async disableUserRecord(id: number): Promise<any> {}
}

export default new UsersService();
