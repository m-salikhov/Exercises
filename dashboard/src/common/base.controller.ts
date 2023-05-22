import { Router } from "express";
import { LoggerService } from "src/logger/logger.service";
import { ControllerRoute } from "./route.interface";

export abstract class BaseController {
  private readonly _router: Router;
  logger: LoggerService;

  constructor(logger: LoggerService) {
    this._router = Router();
    this.logger = logger;
  }

  get router() {
    return this._router;
  }

  protected bindRoutes(routes: ControllerRoute[]) {}
}
