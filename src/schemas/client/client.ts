import { pgTable, uuid, text, timestamp, numeric } from "drizzle-orm/pg-core";
import { manager } from "../manager/manager";

export const client = pgTable("client", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  number: numeric("number"),
  clientImg: text("client_img"),
  companyName: text("company_name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  managerId: uuid("manager_id")
    .notNull()
    .references(() => manager.id, { onDelete: "cascade" }),
});
