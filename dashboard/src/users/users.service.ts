import { UserLoginDTO } from "./dto/user-login.dto";
import { UserRegisterDTO } from "./dto/user-register.dto";
import { IUserService } from "./user.service.interface";
import { User } from "./user.entity";
import { inject, injectable } from "inversify";
import { IConfigService } from "../config/config.service.interface";
import { Types } from "../types";
import { IUsersRepository } from "./users.repository.interface";
import { UserModel } from "@prisma/client";

@injectable()
export class UserService implements IUserService {
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

  async validateUser(dto: UserLoginDTO) {
    return true;
  }
}
