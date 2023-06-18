import "reflect-metadata";
import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import { Types } from "./types";
import { IExeptionFilter } from "./errors/exeption.filter.interface";
import { ExeptionFilter } from "./errors/exeption.filter";
import { ILogger } from "./logger/logger.interface";
import { LoggerService } from "./logger/logger.service";
import { IUserController } from "./users/user.controller.interface";
import { UserController } from "./users/users.controller";
import { UserService } from "./users/users.service";
import { IUserService } from "./users/user.service.interface";
import { ConfigService } from "./config/config.service";
import { IConfigService } from "./config/config.service.interface";

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<App>(Types.App).to(App).inSingletonScope();
  bind<IExeptionFilter>(Types.ExeptionFilter)
    .to(ExeptionFilter)
    .inSingletonScope();
  bind<IUserController>(Types.UserController)
    .to(UserController)
    .inSingletonScope();
  bind<IUserService>(Types.UserService).to(UserService).inSingletonScope();
  bind<ILogger>(Types.LoggerService).to(LoggerService).inSingletonScope();
  bind<IConfigService>(Types.ConfigService)
    .to(ConfigService)
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
