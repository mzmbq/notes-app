import { Transform } from "class-transformer";
import {
  IsHexColor,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

class CreateTagDto {
  @IsString()
  @MinLength(1, { message: "Title must be at least 1 char" })
  @MaxLength(20, { message: "Tag must be less then 20 chars" })
  @Transform(({ value }: { value: string }) => value.trim())
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
  @MinLength(1, { message: "Title must be at least 1 char" })
  @MaxLength(20, { message: "Tag must be less then 20 chars" })
  @Transform(({ value }: { value: string }) => value.trim())
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
