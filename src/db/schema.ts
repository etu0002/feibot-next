// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  bigint,
  index,
  mysqlTableCreator,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `feibot_${name}`);

export const messages = mysqlTable("messages", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  bot: boolean("bot").default(false),
  uuid: varchar("uuid", { length: 256 }),
  userUuid: varchar("user_uuid", { length: 256 }),
  userName: varchar("user_name", { length: 256 }),
  userDisplayName: varchar("user_display_name", { length: 256 }),
  channelUuid: varchar("channel_uuid", { length: 256 }),
  channelName: varchar("channel_name", { length: 256 }),
  serverUuid: varchar("server_uuid", { length: 256 }),
  serverName: varchar("server_name", { length: 256 }),
  content: text("content"),
  cleanContent: text("clean_content"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const openaiLogs = mysqlTable("openai_logs", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  prompt: text("prompt"),
  promthLength: bigint("prompt_length", { mode: "number" }),
  response: text("response"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const botLogs = mysqlTable("bot_logs", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  message: text("message"),
  channelUuid: varchar("channel_uuid", { length: 256 }),
  messageIsDirectedAtBot: boolean("message_is_directed_at_bot"),
  response: text("response"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const channels = mysqlTable("channels", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  threadUuid: varchar("thread_uuid", { length: 256 }),
  uuid: varchar("uuid", { length: 256 }),
  name: varchar("name", { length: 256 }),
  serverUuid: varchar("server_uuid", { length: 256 }),
  serverName: varchar("server_name", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const threads = mysqlTable("threads", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  uuid: varchar("uuid", { length: 256 }),
  channelUuid: varchar("channel_uuid", { length: 256 }),
  userUuid: varchar("user_uuid", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const messageSent = mysqlTable("message_sent", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  messageUuid: varchar("message_uuid", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});
