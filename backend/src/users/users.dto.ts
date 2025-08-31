import { PartialType } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword } from "class-validator";

class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  password: string;
}

class UpdateUserDto extends PartialType(CreateUserDto) {}

export { CreateUserDto, UpdateUserDto };
