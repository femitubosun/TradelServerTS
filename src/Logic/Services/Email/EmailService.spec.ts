import { EmailService } from "Logic/Services/Email/EmailService";

describe("Email Service Test", () => {
  it("Should exist", async () => {
    expect(EmailService.sendEmail()).toEqual(1);
  });
});
