import { DotenvConfigOutput, config } from "dotenv";
import { IConfigService } from "./config.service.interface";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/logger.interface";
import { Types } from "../types";

@injectable()
export class ConfigService implements IConfigService {
  private config: DotenvConfigOutput;
  constructor(@inject(Types.LoggerService) private loggerService: ILogger) {
    const result = config();
    if (result.error) {
      this.loggerService.error("Can't read .env");
    } else {
      this.config = result;
    }
  }

  get<T extends string | number>(key: string): T {
    return this.config[key] as T;
  }
}
