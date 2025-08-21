import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { isCorrectPassword } from "src/util/passwordHelpers";
import { AuthReq, AuthResp, SignInData, SignUpResp } from "notes-app-types";
import { CreateUserDto } from "src/users/users.dto";
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(input: AuthReq): Promise<SignInData> {
    const user = await this.usersService.getUserByUsername(input.username);
    if (user && (await isCorrectPassword(input.password, user.passwordHash))) {
      return {
        userId: user.id,
        username: user.username,
      };
    }
    throw new Error("validate user failed");
  }

  async authenticate(input: AuthReq): Promise<AuthResp> {
    const user = await this.validateUser(input);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.signIn(user);
  }

  async signIn(user: SignInData): Promise<AuthResp> {
    const tokenPayload = {
      sub: user.userId,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return { accessToken, username: user.username, userId: user.userId };
  }

  async signup(input: CreateUserDto): Promise<SignUpResp> {
    const user = await this.usersService.createUser(input);

    const authResult = await this.signIn({
      userId: user.id,
      username: user.username,
    });

    return {
      id: user.id,
      username: user.username,
      token: authResult.accessToken,
    };
  }
}
