import { UserLoginDTO } from "./dto/user-login.dto";
import { UserRegisterDTO } from "./dto/user-register.dto";
import { IUserService } from "./user.service.interface";
import { User } from "./user.entity";
import { injectable } from "inversify";

@injectable()
export class UserService implements IUserService {
  async createUser({
    email,
    name,
    password,
  }: UserRegisterDTO): Promise<User | null> {
    const newUser = new User(email, name);
    await newUser.setPassword(password);
    return newUser;
    // return null;
  }

  async validateUser(dto: UserLoginDTO) {
    return true;
  }
}
