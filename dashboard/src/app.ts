import express from "express";
import userRouter from "./users/users";
import { Server } from "http";
import { LoggerService } from "./logger/logger.service";

export class App {
  app: express.Express;
  port: number;
  server: Server;
  logger: LoggerService;

  constructor(logger: LoggerService) {
    this.app = express();
    this.port = 8000;
    this.logger = logger;
  }

  useRoutes() {
    this.app.use("/users", userRouter);
  }

  async init() {
    this.useRoutes();
    this.server = this.app.listen(this.port);
    this.logger.log(`Server listen on port ${this.port}`);
  }
}
