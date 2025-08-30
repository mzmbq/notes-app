import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { users } from "src/db/user";
import { CurrentUser, User } from "notes-app-types";
import { CreateUserDto, UpdateUserDto } from "./users.dto";
import { eq } from "drizzle-orm";
import { hashPassword } from "src/util/passwordHelpers";
import { DatabaseError } from "pg";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    try {
      const user = await this.databaseService
        .getDB()
        .insert(users)
        .values({
          email: dto.email,
          username: dto.username,
          passwordHash: await hashPassword(dto.password),
        })
        .returning();
      return user[0];
    } catch (err) {
      if (err instanceof DatabaseError) {
        if (err.constraint === "user_email_unique") {
          throw new ConflictException(`This email is already taken`);
        }
        if (err.constraint === "user_username_unique") {
          throw new ConflictException(`This username is already taken`);
        }
      }
      throw err;
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const result = await this.databaseService
        .getDB()
        .select()
        .from(users)
        .where(eq(users.id, id));
      const user = result[0];
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (err) {
      if (err instanceof DatabaseError) {
        // TODO: handle specific DB errors
        this.logger.warn(`[] Unhandled DB error: ${err.constraint}`, {
          cause: err,
        });
      }
      throw err;
    }
  }

  async getUserByUsername(username: string): Promise<User> {
    try {
      const result = await this.databaseService
        .getDB()
        .select()
        .from(users)
        .where(eq(users.username, username));
      const user = result[0];
      if (!user) {
        throw new NotFoundException(
          `User with username "${username}" not found`,
        );
      }
      return user;
    } catch (err) {
      if (err instanceof DatabaseError) {
        // TODO: handle specific DB errors
        this.logger.warn(`[] Unhandled DB error: ${err.constraint}`, {
          cause: err,
        });
      }
      throw err;
    }
  }

  async updateUser(
    currentUser: CurrentUser,
    id: string,
    dto: UpdateUserDto,
  ): Promise<User> {
    const foundUser = await this.getUserById(id);
    if (currentUser.userId !== foundUser.id) {
      throw new ForbiddenException("You can't update another user");
    }
    try {
      await this.databaseService
        .getDB()
        .update(users)
        .set({
          email: dto.email,
          username: dto.username,
          passwordHash: dto.password && (await hashPassword(dto.password)),
          updatedAt: new Date(),
        })
        .where(eq(users.id, id));
    } catch (err) {
      if (err instanceof DatabaseError) {
        if (err.constraint === "user_email_unique") {
          throw new ConflictException(
            "Failed updating user. This email is already taken",
          );
        }
        if (err.constraint === "user_username_unique") {
          throw new ConflictException(
            "Failed updating user. This username is already taken",
          );
        }
      }
      throw err;
    }
    return this.getUserById(id);
  }
}
