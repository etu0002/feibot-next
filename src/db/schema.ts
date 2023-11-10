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

export const messages = mysqlTable('messages', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  uuid: varchar('uuid', { length: 256 }),
  userUuid: varchar('user_uuid', { length: 256 }),
  userName: varchar('user_name', { length: 256 }),
  channelUuid: varchar('channel_uuid', { length: 256 }),
  serverUuid: varchar('server_uuid', { length: 256 }),
  serverName: varchar('server_name', { length: 256 }),
  content: text('content'),
  cleanContent: text('clean_content'),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt').onUpdateNow()
})
