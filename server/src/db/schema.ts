import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const replaysTable = sqliteTable("replays_table", {
  name: text().notNull(),
  session: text().notNull(),
});
