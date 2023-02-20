import { EmailService } from "Logic/Services/Email/EmailService";

describe("Email Service Test", () => {
  it("Should exist", async () => {
    expect(
      EmailService.sendAccountActivationEmail({
        userEmail: "122",
        activationToken: "111",
      })
    ).toEqual(1);
  });
});
