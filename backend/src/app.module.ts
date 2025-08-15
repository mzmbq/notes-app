import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { NotesModule } from "./notes/notes.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [UsersModule, NotesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
