import { Router } from "express";
import { ControllerRoute } from "./route.interface";
import { LoggerService } from "../logger/logger.service";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export abstract class BaseController {
  private readonly _router: Router;

  constructor(protected logger: LoggerService) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  protected bindRoutes(routes: ControllerRoute[]) {
    for (const route of routes) {
      this.logger.log(`${route.method} on ${route.path}`);
      const handler = route.func.bind(this);
      this.router[route.method](route.path, handler);
    }
  }
}
