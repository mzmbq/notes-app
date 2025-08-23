/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./guards/auth.guard";
import { LoginDto } from "./auth.dto";
import { CreateUserDto } from "src/users/users.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  login(@Body() input: LoginDto) {
    return this.authService.login(input);
  }

  @Post("signup")
  signUp(@Body() input: CreateUserDto) {
    return this.authService.signup(input);
  }

  @UseGuards(AuthGuard)
  @Get("me")
  getUserInfo(@Request() req) {
    return req.user;
  }
}
