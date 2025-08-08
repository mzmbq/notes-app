import { Module } from "@nestjs/common";
import { drizzle } from "drizzle-orm/node-postgres";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";

const db = drizzle(process.env.DATABASE_URL!);

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
