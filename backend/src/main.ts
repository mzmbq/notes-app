import "reflect-metadata";
import * as dotenv from "dotenv";

dotenv.config({
  quiet: true,
});

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import { createLogger, format, transports } from "winston";
import * as winston from "winston";
import { utilities as nestWinstonModuleUtilities } from "nest-winston";

const setupLogger = () => {
  return createLogger({
    level: "debug",
    format: format.json(),
    transports: [
      new transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike("notes-app", {
            processId: false,
            appName: false,
          }),
        ),
      }),
      new winston.transports.File({
        filename: "notes-app-backend.log",
      }),
      new winston.transports.File({
        filename: "notes-app-backend-errors.log",
        level: "error",
      }),
    ],
  });
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Replace the default NestJS logger with winston
    logger: WinstonModule.createLogger({ instance: setupLogger() }),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      // Enable `@Transform` decorator for all DTOs
      transform: true,
    }),
  );

  // Temporary fix
  // TODO: implement prperly
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
