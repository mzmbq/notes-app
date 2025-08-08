import { IsEmail, IsString } from "class-validator";

class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;
}

export { CreateUserDto };
