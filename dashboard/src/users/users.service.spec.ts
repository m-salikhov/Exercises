import "reflect-metadata";
import { Container } from "inversify";
import { describe } from "node:test";
import { IConfigService } from "../config/config.service.interface";
import { IUsersService } from "./user.service.interface";
import { IUsersRepository } from "./users.repository.interface";
import { UsersService } from "./users.service";
import { Types } from "../types";
import { User } from "./user.entity";
import { UserModel } from "@prisma/client";

const configServiceMock: IConfigService = {
  get: jest.fn(),
};

const usersRepositoryMock: IUsersRepository = {
  find: jest.fn(),
  create: jest.fn(),
};

const container = new Container();

let configService: IConfigService;
let usersService: IUsersService;
let usersRepository: IUsersRepository;
let createdUser: UserModel;

beforeAll(() => {
  container.bind<IUsersService>(Types.UsersService).to(UsersService);
  container
    .bind<IConfigService>(Types.ConfigService)
    .toConstantValue(configServiceMock);
  container
    .bind<IUsersRepository>(Types.UsersRepository)
    .toConstantValue(usersRepositoryMock);

  configService = container.get<IConfigService>(Types.ConfigService);
  usersService = container.get<IUsersService>(Types.UsersService);
  usersRepository = container.get<IUsersRepository>(Types.UsersRepository);
});

describe("Users Service", () => {
  it("Create User", async () => {
    configService.get = jest.fn().mockReturnValueOnce("4");
    usersRepository.create = jest.fn().mockImplementationOnce(
      (user: User): UserModel => ({
        email: user.email,
        name: user.name,
        password: user.password,
        id: 1,
      })
    );

    createdUser = await usersService.createUser({
      email: "test@test.com",
      name: "Myach",
      password: "1234",
    });

    expect(createdUser.id).toEqual(1);
    expect(createdUser.password).not.toEqual("1234");
  });

  it("Validate User success", async () => {
    usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
    const res = await usersService.validateUser({
      email: "test@test.com",
      password: "1234",
    });
    expect(res).toBeTruthy();
  });

  it("Validate User - wrong password", async () => {
    usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
    const res = await usersService.validateUser({
      email: "test@test.com",
      password: "12345",
    });
    expect(res).toBeFalsy();
  });

  it("Validate User - user not found", async () => {
    usersRepository.find = jest.fn().mockReturnValueOnce(null);
    const res = await usersService.validateUser({
      email: "test@test.com",
      password: "1234",
    });
    expect(res).toBeFalsy();
  });
});
