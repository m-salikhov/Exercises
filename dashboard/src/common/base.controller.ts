import { Router } from "express";
import { ControllerRoute } from "./route.interface";
import { LoggerService } from "../logger/logger.service";

export abstract class BaseController {
  private readonly _router: Router;
  protected logger: LoggerService;

  constructor(logger: LoggerService) {
    this._router = Router();
    this.logger = logger;
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
