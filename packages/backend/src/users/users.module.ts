import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { db } from "src/database/db";

@Module({
  providers: [
    UsersService,
    {
      provide: "DB",
      useValue: db,
    },
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
