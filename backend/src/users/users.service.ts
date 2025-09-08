import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { users } from "src/db/schema/user";
import { CurrentUser, User } from "notes-app-types";
import { CreateUserDto, UpdateUserDto } from "./users.dto";
import { eq } from "drizzle-orm";
import { db } from "src/database/db";
import { isUUID } from "class-validator";
import { hashPassword } from "src/util/passwordHelpers";
import { DatabaseError } from "pg";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  async createUser(dto: CreateUserDto): Promise<User> {
    try {
      const user = await db
        .insert(users)
        .values({
          email: dto.email,
          username: dto.username,
          passwordHash: await hashPassword(dto.password),
        })
        .returning();
      return user[0];
    } catch (err) {
      const dbErr = err instanceof Error && err.cause ? err.cause : undefined;
      if (dbErr instanceof DatabaseError) {
        if (dbErr.constraint === "user_email_unique") {
          this.logger.error(
            `[createUser] Failed creating user. User with email: ${dto.email} already exists`,
            { dbErr },
          );
          throw new ConflictException(
            `[createUser] Failed creating user. User with email: ${dto.email} already exists`,
          );
        }
        if (dbErr.constraint === "user_username_unique") {
          this.logger.error(
            `[createUser] Failed creating user. User with username: ${dto.username} already exists`,
            { dbErr },
          );
          throw new ConflictException(
            `[createUser] Failed creating user. User with username: ${dto.username} already exists`,
          );
        }
      }
      throw new InternalServerErrorException(
        "[createUser] Failed creating user",
      );
    }
  }

  async getUserById(id: string): Promise<User> {
    if (!isUUID(id)) {
      throw new BadRequestException(
        `[getUserById] Invalid user ID format: "${id}"`,
      );
    }
    const result = await db.select().from(users).where(eq(users.id, id));
    const user = result[0];
    if (!user) {
      this.logger.error(`[getUserById] User with ID "${id}" not found`);
      throw new NotFoundException(
        `[getUserById] User with ID "${id}" not found`,
      );
    }
    return user;
  }

  async getUserByUsername(username: string): Promise<User> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    const user = result[0];
    if (!user) {
      throw new NotFoundException(
        `[getUserByUsername] User with username "${username}" not found`,
      );
    }
    return user;
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
      await db
        .update(users)
        .set({
          email: dto.email,
          username: dto.username,
          passwordHash: dto.password && (await hashPassword(dto.password)),
          updatedAt: new Date(),
        })
        .where(eq(users.id, id));
    } catch (err) {
      const dbErr = err instanceof Error && err.cause ? err.cause : undefined;
      if (dbErr instanceof DatabaseError) {
        if (dbErr.constraint === "user_email_unique") {
          this.logger.error(
            `[updateUser] Failed updating user. User with email: ${dto.email} already exists`,
            { dbErr },
          );
          throw new ConflictException(
            `[updateUser] Failed updating user. User with email: ${dto.email} already exists`,
          );
        }
        if (dbErr.constraint === "user_username_unique") {
          this.logger.error(
            `[updateUser] Failed updating user. User with username: ${dto.username} already exists`,
            { dbErr },
          );
          throw new ConflictException(
            `[updateUser] Failed updating user. User with username: ${dto.username} already exists`,
          );
        }
      }
      throw new Error("[updateUser] Failed updating user", { cause: err });
    }
    return this.getUserById(id);
  }
}
