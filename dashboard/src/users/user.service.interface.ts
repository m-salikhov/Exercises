import { UserModel } from "@prisma/client";
import { UserLoginDTO } from "./dto/user-login.dto";
import { UserRegisterDTO } from "./dto/user-register.dto";

export interface IUsersService {
  createUser: (dto: UserRegisterDTO) => Promise<UserModel | null>;
  validateUser: (dto: UserLoginDTO) => Promise<boolean>;
  getUserInfo: (email: string) => Promise<UserModel | null>;
}
