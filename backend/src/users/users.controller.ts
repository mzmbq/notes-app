import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserDto } from "./users.dto";
import { User } from "src/types/user";

@Controller({ path: "user" })
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(dto);
  }

  @Get(":id")
  async getUserById(@Param("id") id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Patch(":id")
  async updateUser(
    @Param("id") id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, dto);
  }
}
