import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { db } from "./db";

const userTable = sqliteTable("user", {
    id: text("id").primaryKey()
});

const sessionTable = sqliteTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: integer("expires_at").notNull()
});

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);