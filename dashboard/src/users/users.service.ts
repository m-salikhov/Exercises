import { UserLoginDTO } from "./dto/user-login.dto";
import { UserRegisterDTO } from "./dto/user-register.dto";
import { IUserService } from "./user.service.interface";
import { User } from "./user.entity";
import { inject, injectable } from "inversify";
import { IConfigService } from "../config/config.service.interface";
import { Types } from "../types";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(Types.ConfigService) private configService: IConfigService
  ) {}
  async createUser({
    email,
    name,
    password,
  }: UserRegisterDTO): Promise<User | null> {
    const newUser = new User(email, name);
    const salt = Number(this.configService.get("SALT"));
    await newUser.setPassword(password, salt);
    return newUser;
    // return null;
  }

  async validateUser(dto: UserLoginDTO) {
    return true;
  }
}
