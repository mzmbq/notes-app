import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { users } from "src/db/user";
import { User } from "src/types/user";
import { CreateUserDto, UpdateUserDto } from "./users.dto";
import { eq, sql } from "drizzle-orm";
import { db } from "src/database/db";
import { isUUID } from "class-validator";
import { hashPassword } from "src/util/passwordHelpers";

@Injectable()
export class UsersService {
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
      if (err instanceof Error) {
        throw new Error("[createUser] Failed creating an user", err);
      }
    }
    throw new Error("[createUser] Failed creating an user (Unknown error)");
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

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const tempDto: UpdateUserDto & { passwordHash?: string } = dto;
    if (dto.password) {
      tempDto.passwordHash = await hashPassword(dto.password);
    }
    try {
      await db
        .update(users)
        .set({ ...tempDto, updatedAt: sql`now()` })
        .where(eq(users.id, id));
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(
          `[updateUser] Failed updating an user with id: ${id}, `,
          err,
        );
      }
      throw new Error(
        `[updateUser] Failed updating an user with id: ${id} (Unknown Error)`,
      );
    }
    return this.getUserById(id);
  }
}
