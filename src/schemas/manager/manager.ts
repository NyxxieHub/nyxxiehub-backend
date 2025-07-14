import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const manager = pgTable("manager", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  supabaseUserAuth: uuid("supabase_user_auth").notNull().unique(),
  companyName: text("company_name"),
  managerImg: text("manager_img"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
