import { PrismaClient, UserModel } from "@prisma/client";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/logger.interface";
import { Types } from "../types";

@injectable()
export class PrismaService {
  client: PrismaClient;

  constructor(@inject(Types.LoggerService) private loggerService: ILogger) {
    this.client = new PrismaClient();
  }

  async connect() {
    try {
      await this.client.$connect();
      this.loggerService.log("[PrismaService] Prisma connect success");
    } catch (error) {
      if (error instanceof Error) {
        this.loggerService.error(
          "[PrismaService] prisma connect error " + error.message
        );
      }
    }
  }

  async disconnect() {
    this.client.$disconnect();
  }
}
