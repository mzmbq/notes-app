import { IsString } from "class-validator";

class Input {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export { Input };
