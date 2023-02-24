import supertest from "supertest";
import { Application } from "Lib/Infra/Internal/Application";
import { container } from "tsyringe";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import { WELCOME_TO_API } from "Helpers/Messages/SystemMessages";

const app = new Application(container);

describe("GET /", () => {
  describe("Valid route", () => {
    it("Should return a 200 status code", async () => {
      await supertest(app.express.app)
        .get("/Interface")
        .expect(HttpStatusCodeEnum.OK);
    });
    it("Should return welcome message", async () => {
      await supertest(app.express.app)
        .get("/Interface")
        .expect(HttpStatusCodeEnum.OK)
        .then((response) => {
          expect(response.body.message).toBe(WELCOME_TO_API);
        });
    });
  });
});
