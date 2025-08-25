import { Module, Logger } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { NotesModule } from "./notes/notes.module";
import { AuthModule } from "./auth/auth.module";
import { TagsModule } from "./tags/tags.module";

@Module({
  imports: [UsersModule, NotesModule, AuthModule, TagsModule],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
