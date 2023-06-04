import "reflect-metadata";
import { Container } from "inversify";
import { App } from "./app";
import { ExeptionFilter } from "./errors/exeption.filter";
import { UserController } from "./users/users.controller";
import { Types } from "./types";
import { IExeptionFilter } from "./errors/exeption.filter.interface";
import { LoggerService } from "./logger/logger.service";
import { ILogger } from "./logger/logger.interface";

const appContainer = new Container();
appContainer.bind<App>(Types.App).to(App);
appContainer.bind<IExeptionFilter>(Types.ExeptionFilter).to(ExeptionFilter);
appContainer.bind<UserController>(Types.UserController).to(UserController);
appContainer.bind<ILogger>(Types.LoggerService).to(LoggerService);
const app = appContainer.get<App>(Types.App);

app.init();

export { app, appContainer };
