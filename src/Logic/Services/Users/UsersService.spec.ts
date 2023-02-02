import UsersService from "./UsersService";

describe("UsersServiceTest", () => {
  it("should be defined", () => {
    const userService = UsersService;
    expect(userService).toBeDefined();
  });
});
