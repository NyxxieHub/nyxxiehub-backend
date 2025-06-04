import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { managers } from "./managers";

export const loginTokens = pgTable("login_tokens", {
  id: serial("id").primaryKey(),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  managerId: integer("manager_id")
    .references(() => managers.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
