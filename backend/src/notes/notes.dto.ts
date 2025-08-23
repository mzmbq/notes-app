import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

class CreateNoteDto {
  @IsString()
  @MaxLength(100, { message: "Title must be less than 100 chars" })
  title: string;

  @IsString()
  @MaxLength(2000, { message: "Content must be less than 2000 chars" })
  content: string;
}

class UpdateNoteDto {
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: "Title must be less than 100 chars" })
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000, { message: "Content must be less than 2000 chars" })
  content?: string;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;
}

export { CreateNoteDto, UpdateNoteDto };
