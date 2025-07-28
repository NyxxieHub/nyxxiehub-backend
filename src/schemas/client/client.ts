import { pgTable, uuid, text, timestamp, numeric } from "drizzle-orm/pg-core";
import { manager } from "../manager/manager";

export const client = pgTable("client", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  name: text("name").notNull(),
  password: text("password"),
  phone: numeric("phone"),
  niche: text("niche"),
  clientImg: text("client_img"),
  companyName: text("company_name"),
  lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  managerId: uuid("manager_id")
    .notNull()
    .references(() => manager.id, { onDelete: "cascade" }),
});
