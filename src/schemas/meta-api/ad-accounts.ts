import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { client } from "@/schemas/client/client";

export const adAccounts = pgTable("ad_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => client.id, {
      onDelete: "cascade",
    }),
  metaAccountId: text("meta_account_id").notNull().unique(), // ex: act_123456
  name: text("name").notNull(),
  currency: text("currency").notNull(),
  timezone: text("timezone").notNull(),
  status: text("status").notNull(), // exemplo: ACTIVE, DISABLED
});
