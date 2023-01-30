import "reflect-metadata";
import { container, Lifecycle } from "tsyringe";
import { IUserRepository, TestUserRepository } from "Domain/auth";

container.register<IUserRepository>(
  "UserRepository",
  {
    useClass: TestUserRepository,
  },
  {
    lifecycle: Lifecycle.Singleton,
  }
);
