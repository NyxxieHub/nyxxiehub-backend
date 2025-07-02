import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { campaigns } from "./campaigns";

export const adSets = pgTable("ad_sets", {
  id: uuid("id").defaultRandom().primaryKey(),

  campaignId: uuid("campaign_id")
    .notNull()
    .references(() => campaigns.id, {
      onDelete: "cascade",
    }),

  metaAdSetId: text("meta_ad_set_id").notNull().unique(),
  name: text("name").notNull(),
  status: text("status").notNull(), // ACTIVE, PAUSED, etc
  effectiveStatus: text("effective_status").notNull(),
  dailyBudget: integer("daily_budget"), // em centavos
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
});
