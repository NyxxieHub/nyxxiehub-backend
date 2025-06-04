import {
  pgTable,
  serial,
  integer,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { clients } from "./clients";

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id")
    .references(() => clients.id)
    .notNull(),
  preferences: jsonb("preferences").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
