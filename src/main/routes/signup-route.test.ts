import request from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { Collection } from "mongodb";
import env from "../config/env";

let accountCollection: Collection;

describe("SignUp Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });
  test("Should return an account on success", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      })
      .expect(200);
  });
});
