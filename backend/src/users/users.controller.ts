import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./user.dto";
import { User } from "src/types/user";

@Controller({ path: "users" })
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(dto).catch((err) => {
      throw new Error("Error by creating an user", err);
    });
  }
}
