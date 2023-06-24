import { UserLoginDTO } from "./dto/user-login.dto";
import { UserRegisterDTO } from "./dto/user-register.dto";
import { IUsersService } from "./user.service.interface";
import { User } from "./user.entity";
import { inject, injectable } from "inversify";
import { IConfigService } from "../config/config.service.interface";
import { Types } from "../types";
import { IUsersRepository } from "./users.repository.interface";
import { UserModel } from "@prisma/client";

@injectable()
export class UsersService implements IUsersService {
  constructor(
    @inject(Types.ConfigService) private configService: IConfigService,
    @inject(Types.UsersRepository) private usersRepository: IUsersRepository
  ) {}

  async createUser({
    email,
    name,
    password,
  }: UserRegisterDTO): Promise<UserModel | null> {
    const checkUser = await this.usersRepository.find(email);
    if (checkUser) return null;

    const newUser = new User(email, name);
    const salt = Number(this.configService.get("SALT"));
    await newUser.setPassword(password, salt);
    return await this.usersRepository.create(newUser);
  }

  async validateUser({ email, password }: UserLoginDTO) {
    const checkUser = await this.usersRepository.find(email);
    if (!checkUser) return false;

    const newUser = new User(
      checkUser.email,
      checkUser.name,
      checkUser.password
    );

    return await newUser.comparePassword(password);
  }

  async getUserInfo(email: string) {
    return this.usersRepository.find(email);
  }
}
