import "reflect-metadata";
import { inject, injectable } from "inversify";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errors/http-error.class";
import { Response, Request, NextFunction } from "express";
import { ILogger } from "../logger/logger.interface";
import { IUsersController } from "./user.controller.interface";
import { UserLoginDTO } from "./dto/user-login.dto";
import { UserRegisterDTO } from "./dto/user-register.dto";
import { Types } from "../types";
import { ValidateMiddleware } from "../common/validate.middleware";
import { IUsersService } from "./user.service.interface";
import { sign } from "jsonwebtoken";
import { IConfigService } from "../config/config.service.interface";
import { AuthGuard } from "../common/auth.guard";

@injectable()
export class UsersController
  extends BaseController
  implements IUsersController
{
  constructor(
    @inject(Types.LoggerService) public loggerService: ILogger,
    @inject(Types.UsersService) private usersServise: IUsersService,
    @inject(Types.ConfigService) private configService: IConfigService
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: "/login",
        method: "post",
        func: this.login,
        middlewares: [new ValidateMiddleware(UserLoginDTO)],
      },
      {
        path: "/register",
        method: "post",
        func: this.register,
        middlewares: [new ValidateMiddleware(UserRegisterDTO)],
      },
      {
        path: "/info",
        method: "get",
        func: this.info,
        middlewares: [new AuthGuard()],
      },
    ]);
  }

  async login(
    { body }: Request<{}, {}, UserLoginDTO>,
    res: Response,
    next: NextFunction
  ) {
    const result = await this.usersServise.validateUser(body);
    if (!result) {
      next(new HTTPError(401, "Ошибка авторизации", "LOGIN"));
      return;
    }

    const jwt = await this.signJWT(
      body.email,
      this.configService.get("SECRET")
    );

    res.send({ jwt });
  }

  async register(
    { body }: Request<{}, {}, UserRegisterDTO>,
    res: Response,
    next: NextFunction
  ) {
    const result = await this.usersServise.createUser(body);

    if (!result) {
      next(new HTTPError(422, "Пользователь уже существует", "REGISTER"));
      return;
    }

    res.send(result);
  }

  async info({ user }: Request, res: Response, next: NextFunction) {
    const userInfo = await this.usersServise.getUserInfo(user);
    res.send({ email: userInfo.email, id: userInfo.id });
  }

  private signJWT(email: string, secret: string) {
    return new Promise((resolve, reject) => {
      sign(
        { email, iat: Date.now() },
        secret,
        { algorithm: "HS256" },
        (err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token as string);
        }
      );
    });
  }
}
