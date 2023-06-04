import { Router } from "express";
import { ControllerRoute } from "./route.interface";
import { LoggerService } from "../logger/logger.service";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Types } from "../types";

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
      const handler = route.func.bind(this);
      this.router[route.method](route.path, handler);
    }
  }
}
