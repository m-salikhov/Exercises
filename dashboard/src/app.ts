import express from "express";
import { Server } from "http";
import { LoggerService } from "./logger/logger.service";
import { UserController } from "./users/users.controller";
import { ExeptionFilter } from "./errors/exeption.filter";
import { inject, injectable } from "inversify";
import { Types } from "./types";
import "reflect-metadata";

@injectable()
export class App {
  app: express.Express;
  port: number;
  server: Server;

  constructor(
    @inject(Types.UserController) private userController: UserController,
    @inject(Types.LoggerService) private loggerService: LoggerService,
    @inject(Types.ExeptionFilter) private exeptionFilter: ExeptionFilter
  ) {
    console.log(3);
    this.app = express();
    this.port = 8000;
  }

  useMid() {
    this.app.use(express.json());
  }

  useRoutes() {
    this.app.use("/users", this.userController.router);
  }

  useExeptionFilter() {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  async init() {
    this.useMid();
    this.useRoutes();
    this.useExeptionFilter();
    this.server = this.app.listen(this.port);
    this.loggerService.log(`Server listen on port ${this.port}`);
  }
}
