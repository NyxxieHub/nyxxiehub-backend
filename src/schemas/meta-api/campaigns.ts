import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { adAccounts } from "./ad-accounts";

export const campaigns = pgTable("campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),

  adAccountId: uuid("ad_account_id")
    .notNull()
    .references(() => adAccounts.id, { onDelete: "cascade" }),

  metaCampaignId: text("meta_campaign_id").notNull().unique(),
  name: text("name").notNull(),
  status: text("status").notNull(),
  objective: text("objective").notNull(),
  startTime: timestamp("start_time", { withTimezone: true }),
  stopTime: timestamp("stop_time", { withTimezone: true }),

  createdTime: timestamp("created_time", { withTimezone: true }).notNull(),
  updatedTime: timestamp("updated_time", { withTimezone: true }),
  effectiveStatus: text("effective_status").notNull(),
});
