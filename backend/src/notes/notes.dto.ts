import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

class CreateNoteDto {
  @IsString()
  @MinLength(1, { message: "Title must be at least 1 char" })
  @MaxLength(100, { message: "Title must be less than 100 chars" })
  @Transform(({ value }: { value: string }) => value.trim())
  title: string;

  @IsString()
  @MaxLength(2000, { message: "Content must be less than 2000 chars" })
  @Transform(({ value }: { value: string }) => value.trim())
  content: string;

  // TODO: add the rest of the fields
}

class UpdateNoteDto {
  @IsString()
  @IsOptional()
  @MinLength(1, { message: "Title must be at least 1 char" })
  @MaxLength(100, { message: "Title must be less than 100 chars" })
  @Transform(({ value }: { value: string }) => value.trim())
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000, { message: "Content must be less than 2000 chars" })
  @Transform(({ value }: { value: string }) => value.trim())
  content?: string;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;
}

export { CreateNoteDto, UpdateNoteDto };
