import express from "express";
import { Server } from "http";
import { UserController } from "./users/users.controller";
import { inject, injectable } from "inversify";
import { Types } from "./types";
import "reflect-metadata";
import { IUserController } from "./users/user.controller.interface";
import { ILogger } from "./logger/logger.interface";
import { IExeptionFilter } from "./errors/exeption.filter.interface";
import { IConfigService } from "./config/config.service.interface";
import { PrismaService } from "./database/prisma.service";

@injectable()
export class App {
  app: express.Express;
  port: number;
  server: Server;

  constructor(
    @inject(Types.UserController) private userController: UserController,
    @inject(Types.LoggerService) private loggerService: ILogger,
    @inject(Types.ExeptionFilter) private exeptionFilter: IExeptionFilter,
    @inject(Types.ConfigService) private configService: IConfigService,
    @inject(Types.PrismaService) private prismaService: PrismaService
  ) {
    this.app = express();
    this.port = +this.configService.get("PORT") || 8000;
  }

  useBodyParser() {
    this.app.use(express.json());
  }

  useRoutes() {
    this.app.use("/users", this.userController.router);
  }

  useExeptionFilter() {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  async init() {
    this.useBodyParser();
    this.useRoutes();
    this.useExeptionFilter();
    await this.prismaService.connect();
    this.server = this.app.listen(this.port);
    this.loggerService.log(`Server listen on port ${this.port}`);
  }
}
