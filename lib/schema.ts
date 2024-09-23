import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const userTable = sqliteTable("user", {
    id: text("id").primaryKey(),
    username: text("username").notNull(),
    password: text("password").notNull()
});

export const sessionTable = sqliteTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id, { onDelete: "cascade" }),
    expiresAt: integer("expires_at").notNull()
});

export const postTable = sqliteTable("post", {
    id: text("id").primaryKey().default(nanoid()),
    title: text("title").notNull(),
    content: text("content").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id, { onDelete: "cascade" }),
    createdAt: integer("created_at").notNull(),
    published: integer("published").notNull().default(0)
});

export const likeTable = sqliteTable("like", {
    id: text("id").primaryKey(),
    postId: text("post_id")
        .notNull()
        .references(() => postTable.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id, { onDelete: "cascade" }),
    createdAt: integer("created_at").notNull().default(Date.now())
});
