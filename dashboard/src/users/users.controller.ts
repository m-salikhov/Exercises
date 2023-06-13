import { injectable } from "inversify";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errors/http-error.class";
import { Response, Request, NextFunction } from "express";
import { ILogger } from "../logger/logger.interface";
import { IUserController } from "./user.controller.interface";
import "reflect-metadata";
import { UserLoginDTO } from "./dto/user-login.dto";
import { UserRegisterDTO } from "./dto/user-register.dto";
import { User } from "./user.entity";

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(loggerService: ILogger) {
    super(loggerService);
    this.bindRoutes([
      { path: "/login", method: "post", func: this.login },
      { path: "/register", method: "post", func: this.register },
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
    const newUser = new User(body.email, body.name);
    await newUser.setPassword(body.password);
    res.send(newUser);
  }
}
