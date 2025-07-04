import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const manager = pgTable("manager", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  supabaseUserAuth: uuid("supabase_user_auth").notNull(),
  companyName: text("company_name"),
  mangerImg: text("manager_img").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
