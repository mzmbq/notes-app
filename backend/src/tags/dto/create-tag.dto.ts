import { IsHexColor, IsString, MaxLength } from "class-validator";

class CreateTagDto {
  @IsString()
  @MaxLength(50, { message: "Tag must be less then 50 chars" })
  name: string;

  @IsString()
  @IsHexColor({ message: "Text color must be HEX like #RRGGBB or #RGB" })
  textColor: string;

  @IsString()
  @IsHexColor({ message: "Text color must be HEX like #RRGGBB or #RGB" })
  backgroundColor: string;
}

export { CreateTagDto };
