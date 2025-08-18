import { IsString } from "class-validator";

class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export { LoginDto };
