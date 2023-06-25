import { App } from "../src/app";
import { boot } from "../src/main";
import request from "supertest";
let application: App;

beforeAll(async () => {
  const { app } = await boot;
  application = app;
});

describe("Users e2e", () => {
  it("Register - error", async () => {
    const res = await request(application.app)
      .post("/users/register")
      .send({ email: "test2@test.ru", password: "qwerty" });
    expect(res.status).toBe(422);
  });

  it("Login - success", async () => {
    const res = await request(application.app)
      .post("/users/login")
      .send({ email: "test2@test.ru", password: "qwerty" });
    expect(res.body.jwt).not.toBeUndefined();
  });
  it("Login - error", async () => {
    const res = await request(application.app)
      .post("/users/login")
      .send({ email: "test2@test.ru", password: "qwerty1" });
    expect(res.body.jwt).toBeUndefined();
  });

  it("Info - success", async () => {
    const login = await request(application.app)
      .post("/users/login")
      .send({ email: "test2@test.ru", password: "qwerty" });
    const res = await request(application.app)
      .get("/users/info")
      .set("Authorization", "Bearer " + login.body.jwt);
    expect(res.body.email).toBe("test2@test.ru");
  });
  it("Info - error", async () => {
    const login = await request(application.app)
      .post("/users/login")
      .send({ email: "test2@test.ru", password: "qwerty" });
    const res = await request(application.app)
      .get("/users/info")
      .set("Authorization", "Bearer " + login.body.email);
    expect(res.statusCode).toBe(401);
  });
});

afterAll(() => {
  application.close();
});
