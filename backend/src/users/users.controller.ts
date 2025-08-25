import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserDto } from "./users.dto";
import type { User, CurrentUser } from "notes-app-types";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { CurrentUser as CurrentUserDecorator } from "src/common/decorators/current-user.decorator";

@Controller({ path: "user" })
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(dto);
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  async getUserById(@Param("id", ParseUUIDPipe) id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  async updateUser(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUserDecorator() user: CurrentUser,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(user, id, dto);
  }
}
