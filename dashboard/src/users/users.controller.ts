import { injectable } from "inversify";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errors/http-error.class";
import { LoggerService } from "../logger/logger.service";
import { Response, Request, NextFunction } from "express";
import "reflect-metadata";

@injectable()
export class UserController extends BaseController {
  constructor(loggerService: LoggerService) {
    super(loggerService);
    this.bindRoutes([
      { path: "/login", method: "post", func: this.login },
      { path: "/register", method: "post", func: this.register },
    ]);
  }

  login(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    next(new HTTPError(401, "not auth", "LOGIN"));
  }

  register(req: Request, res: Response, next: NextFunction) {
    this.loggerService.log("REGISTER");
    res.send(["REGISTER"]);
  }
}
