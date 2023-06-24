import "reflect-metadata";
import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import { Types } from "./types";
import { IExeptionFilter } from "./errors/exeption.filter.interface";
import { ExeptionFilter } from "./errors/exeption.filter";
import { ILogger } from "./logger/logger.interface";
import { LoggerService } from "./logger/logger.service";
import { IUsersController } from "./users/user.controller.interface";
import { UsersController } from "./users/users.controller";
import { UsersService } from "./users/users.service";
import { IUsersService } from "./users/user.service.interface";
import { ConfigService } from "./config/config.service";
import { IConfigService } from "./config/config.service.interface";
import { PrismaService } from "./database/prisma.service";
import { UsersRepository } from "./users/users.repository";
import { IUsersRepository } from "./users/users.repository.interface";

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<App>(Types.App).to(App).inSingletonScope();
  bind<IExeptionFilter>(Types.ExeptionFilter)
    .to(ExeptionFilter)
    .inSingletonScope();
  bind<IUsersController>(Types.UsersController).to(UsersController);
  bind<IUsersService>(Types.UsersService).to(UsersService);
  bind<ILogger>(Types.LoggerService).to(LoggerService).inSingletonScope();
  bind<IConfigService>(Types.ConfigService)
    .to(ConfigService)
    .inSingletonScope();
  bind<PrismaService>(Types.PrismaService).to(PrismaService);
  bind<IUsersRepository>(Types.UsersRepository)
    .to(UsersRepository)
    .inSingletonScope();
});

function bootstrap() {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(Types.App);
  app.init();
  return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
