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
import { Input } from "./auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  login(@Body() input: Input) {
    return this.authService.authenticate(input);
  }

  @UseGuards(AuthGuard)
  @Get("me")
  getUserInfo(@Request() req) {
    return req.user;
  }
}
