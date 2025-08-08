import { Injectable } from "@nestjs/common";
import { users } from "src/db/user";
import { User } from "src/types/user";
import { CreateUserDto } from "./user.dto";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

@Injectable()
export class UsersService {
  async createUser(dto: CreateUserDto): Promise<User> {
    console.log("DB instance: ", db);
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
}
