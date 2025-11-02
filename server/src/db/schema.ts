import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const replaysTable = sqliteTable("replays_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const sessionEntriesTable = sqliteTable("session_entries_table", {
  id: int()
    .notNull()
    .references(() => replaysTable.id),
  index: int().notNull(),
  value: text().notNull(),
});
