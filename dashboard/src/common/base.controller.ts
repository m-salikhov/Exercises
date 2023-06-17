import { Router } from "express";
import { ControllerRoute } from "./route.interface";
import { LoggerService } from "../logger/logger.service";
import { inject, injectable } from "inversify";
import { Types } from "../types";
import "reflect-metadata";

@injectable()
export abstract class BaseController {
  private readonly _router: Router;

  constructor(
    @inject(Types.LoggerService) protected loggerService: LoggerService
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  protected bindRoutes(routes: ControllerRoute[]) {
    for (const route of routes) {
      this.loggerService.log(`${route.method} on ${route.path}`);

      const middleware = route.middlewares?.map((v) => v.execute.bind(v));

      const handler = route.func.bind(this);

      const pipeline = middleware ? [...middleware, handler] : handler;

      this.router[route.method](route.path, pipeline);
    }
  }
}
