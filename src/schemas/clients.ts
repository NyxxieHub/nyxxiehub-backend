import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { managers } from "./managers";

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  managerId: integer("manager_id")
    .references(() => managers.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
