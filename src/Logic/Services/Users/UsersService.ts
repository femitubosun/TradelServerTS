import { CreateUserRecordDTO, IUser, UpdateUserRecordDTO } from "./Options";
import { autoInjectable } from "tsyringe";
import { DBContext } from "Lib/Infra/Internal/DBContext";
import { Users } from "Domain/Entities/Users";
import { DATABASE_ERROR } from "Utils/Messages";
import { InternalServerError } from "Logic/Exceptions";

@autoInjectable()
class UsersService {
  private userRepo: any;

  constructor(private dbContext?: DBContext) {
    this.userRepo = dbContext?.getEntityRepository(Users);
  }

  public async createUserRecord(createUserRecordDTO: CreateUserRecordDTO) {
    const user = new Users();
    user.email = createUserRecordDTO.email;
    user.firstName = createUserRecordDTO.firstName;
    user.lastName = createUserRecordDTO.lastName;
    user.password = createUserRecordDTO.password;
    user.role = createUserRecordDTO.role;
    try {
      await this.userRepo.save(user);
    } catch (e) {
      console.error();
      throw new InternalServerError(DATABASE_ERROR);
    }
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
