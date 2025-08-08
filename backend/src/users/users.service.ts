import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { users } from "src/db/user";
import { User } from "src/types/user";
import { CreateUserDto } from "./users.dto";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { db } from "src/database/db";
import { isUUID } from "class-validator";

dotenv.config();

@Injectable()
export class UsersService {
  async createUser(dto: CreateUserDto): Promise<User> {
    const salt = 10;
    const hash = await bcrypt.hash(dto.password, salt);
    try {
      const user = await db
        .insert(users)
        .values({
          email: dto.email,
          username: dto.username,
          passwordHash: hash,
        })
        .returning();
      return user[0];
    } catch (err) {
      if (err instanceof Error) {
        throw new Error("Failed by creating an user", err);
      }
    }
    throw new Error("Failed by creating an user (Unknown error)");
  }

  async getUserById(id: string): Promise<User> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid user ID format: "${id}"`);
    }
    const result = await db.select().from(users).where(eq(users.id, id));
    const user = result[0];
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }
}
