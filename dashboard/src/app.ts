import express from "express";
import { Server } from "http";
import { LoggerService } from "./logger/logger.service";
import { UserController } from "./users/users.controller";

export class App {
  app: express.Express;
  port: number;
  server: Server;
  logger: LoggerService;
  UserController: UserController;

  constructor(logger: LoggerService, UserController: UserController) {
    this.app = express();
    this.port = 8000;
    this.logger = logger;
    this.UserController = UserController;
  }

  useMid() {
    this.app.use(express.json());
  }

  useRoutes() {
    this.app.use("/users", this.UserController.router);
  }

  useExeptionFilter() {}

  async init() {
    this.useMid();
    this.useRoutes();
    this.server = this.app.listen(this.port);
    this.logger.log(`Server listen on port ${this.port}`);
  }
}
