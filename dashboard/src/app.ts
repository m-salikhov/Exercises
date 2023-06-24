import "reflect-metadata";
import express from "express";
import { Server } from "http";
import { UsersController } from "./users/users.controller";
import { inject, injectable } from "inversify";
import { Types } from "./types";
import { IUsersController } from "./users/user.controller.interface";
import { ILogger } from "./logger/logger.interface";
import { IExeptionFilter } from "./errors/exeption.filter.interface";
import { IConfigService } from "./config/config.service.interface";
import { PrismaService } from "./database/prisma.service";
import { AuthMiddleware } from "./common/auth.middleware";

@injectable()
export class App {
  app: express.Express;
  port: number;
  server: Server;

  constructor(
    @inject(Types.UsersController) private usersController: UsersController,
    @inject(Types.LoggerService) private loggerService: ILogger,
    @inject(Types.ExeptionFilter) private exeptionFilter: IExeptionFilter,
    @inject(Types.ConfigService) private configService: IConfigService,
    @inject(Types.PrismaService) private prismaService: PrismaService
  ) {
    this.app = express();
    this.port = +this.configService.get("PORT") || 8000;
  }

  useMidllewares() {
    //body parser
    this.app.use(express.json());
    //jwt
    const authMiddleware = new AuthMiddleware(this.configService.get("SECRET"));
    this.app.use(authMiddleware.execute.bind(authMiddleware));
  }

  useRoutes() {
    this.app.use("/users", this.usersController.router);
  }

  useExeptionFilter() {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  async init() {
    this.useMidllewares();
    this.useRoutes();
    this.useExeptionFilter();
    await this.prismaService.connect();
    this.server = this.app.listen(this.port);
    this.loggerService.log(`Server listen on port ${this.port}`);
  }
}
