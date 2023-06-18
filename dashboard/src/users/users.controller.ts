import { inject, injectable } from "inversify";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errors/http-error.class";
import { Response, Request, NextFunction } from "express";
import { ILogger } from "../logger/logger.interface";
import { IUserController } from "./user.controller.interface";
import "reflect-metadata";
import { UserLoginDTO } from "./dto/user-login.dto";
import { UserRegisterDTO } from "./dto/user-register.dto";
import { Types } from "../types";
import { ValidateMiddleware } from "../common/validate.middleware";
import { IUserService } from "./user.service.interface";

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @inject(Types.LoggerService) public loggerService: ILogger,
    @inject(Types.UserService) private userServise: IUserService
  ) {
    super(loggerService);
    this.bindRoutes([
      { path: "/login", method: "post", func: this.login },
      {
        path: "/register",
        method: "post",
        func: this.register,
        middlewares: [new ValidateMiddleware(UserRegisterDTO)],
      },
    ]);
  }

  login(req: Request<{}, {}, UserLoginDTO>, res: Response, next: NextFunction) {
    next(new HTTPError(401, "not auth", "LOGIN"));
  }

  async register(
    { body }: Request<{}, {}, UserRegisterDTO>,
    res: Response,
    next: NextFunction
  ) {
    const result = await this.userServise.createUser(body);

    if (!result) {
      next(new HTTPError(422, "Пользователь уже существует", "REGISTER"));
      return;
    }

    res.send({ email: result.email });
  }
}
