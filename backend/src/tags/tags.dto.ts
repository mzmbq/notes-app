import { IsHexColor, IsOptional, IsString, MaxLength } from "class-validator";

class CreateTagDto {
  @IsString()
  @MaxLength(50, { message: "Tag must be less then 50 chars" })
  title: string;

  @IsString()
  @IsHexColor({ message: "Text color must be HEX like #RRGGBB or #RGB" })
  textColor: string;

  @IsString()
  @IsHexColor({ message: "Text color must be HEX like #RRGGBB or #RGB" })
  backgroundColor: string;
}

class UpdateTagDto {
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: "Tag must be less then 50 chars" })
  title?: string;

  @IsString()
  @IsOptional()
  @IsHexColor({ message: "Text color must be HEX like #RRGGBB or #RGB" })
  textColor?: string;

  @IsString()
  @IsOptional()
  @IsHexColor({ message: "Text color must be HEX like #RRGGBB or #RGB" })
  backgroundColor?: string;
}

export { CreateTagDto, UpdateTagDto };
