import { Response, Request, NextFunction } from "express";
import { LoggerService } from "../logger/logger.service";
import { IExeptionFilter } from "./exeption.filter.interface";
import { HTTPError } from "./http-error.class";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Types } from "../types";

@injectable()
export class ExeptionFilter implements IExeptionFilter {
  constructor(
    @inject(Types.LoggerService) private loggerService: LoggerService
  ) {}

  catch(
    err: Error | HTTPError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (err instanceof HTTPError) {
      this.loggerService.error(
        `[${err.context ? err.context : ""}] Error ${err.statusCode}: ${
          err.message
        }`
      );
      res.status(err.statusCode).send({ err: err.message });
    } else {
      this.loggerService.error(`Error: ${err.message}`);
      res.status(500).send({ err: err.message });
    }
  }
}
