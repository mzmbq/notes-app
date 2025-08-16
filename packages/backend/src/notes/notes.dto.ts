import { IsBoolean, IsOptional, IsString } from "class-validator";

class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  content: string;
}

class UpdateNoteDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsBoolean()
  @IsOptional()
  isFavorite: boolean;
}

export { CreateNoteDto, UpdateNoteDto };
