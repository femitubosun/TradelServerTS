import supertest from "supertest";
import { Application } from "Lib/Infra/Internal/Application/index";
import { container } from "tsyringe";
import { HttpStatusCodeEnum } from "../src/Utils/HttpStatusCodeEnum";

const app = new Application(container);

describe("Onboarding", () => {
  describe("Customer", () => {
    describe("Invalid Credentials", () => {
      it("Should return a 422", async () => {
        await supertest(app.express.app)
          .post("/Interface/Create/Customer")
          .expect(HttpStatusCodeEnum.UNPROCESSABLE_ENTITY);
      });
    });
  });
});
