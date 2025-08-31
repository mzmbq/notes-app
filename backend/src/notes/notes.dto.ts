import { PartialType } from "@nestjs/swagger";
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { TrimString } from "src/common/decorators/transform.decorators";

class CreateNoteDto {
  @IsString()
  @MinLength(1, { message: "Title must be at least 1 char" })
  @MaxLength(100, { message: "Title must be less than 100 chars" })
  @TrimString()
  title: string;

  @IsString()
  @MaxLength(2000, { message: "Content must be less than 2000 chars" })
  @TrimString()
  content: string;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  // TODO: add the rest of the fields
}

class UpdateNoteDto extends PartialType(CreateNoteDto) {}

export { CreateNoteDto, UpdateNoteDto };
