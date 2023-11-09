// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from 'drizzle-orm'
import {
  bigint,
  index,
  mysqlTableCreator,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/mysql-core'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `feibot_${name}`)

export const users = mysqlTable('users', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 256 }),
  uuid: varchar('uuid', { length: 256 }),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt').onUpdateNow()
})

export const servers = mysqlTable('servers', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 256 }),
  uuid: varchar('uuid', { length: 256 }),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt').onUpdateNow()
})

export const channels = mysqlTable('channels', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 256 }),
  uuid: varchar('uuid', { length: 256 }),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt').onUpdateNow()
})

export const messages = mysqlTable('messages', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  userId: bigint('user_id', { mode: 'number' }).notNull(),
  channelId: bigint('channel_id', { mode: 'number' }).notNull(),
  content: text('content'),
  cleanContent: text('clean_content'),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt').onUpdateNow()
})
