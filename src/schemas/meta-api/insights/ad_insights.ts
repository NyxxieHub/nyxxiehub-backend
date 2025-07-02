import {
  pgTable,
  uuid,
  integer,
  doublePrecision,
  jsonb,
  date,
} from "drizzle-orm/pg-core";
import { ads } from "../ads";

export const adInsights = pgTable("ad_insights", {
  id: uuid("id").defaultRandom().primaryKey(),
  adId: uuid("ad_id")
    .notNull()
    .references(() => ads.id, { onDelete: "cascade" }),

  impressions: integer("impressions"),
  reach: integer("reach"),
  frequency: doublePrecision("frequency"),
  clicks: integer("clicks"),
  uniqueClicks: integer("unique_clicks"),
  cpc: doublePrecision("cpc"),
  ctr: doublePrecision("ctr"),
  spend: doublePrecision("spend"),
  cpm: doublePrecision("cpm"),
  cpp: doublePrecision("cpp"),
  costPerInlineLinkClick: doublePrecision("cost_per_inline_link_click"),

  inlineLinkClicks: integer("inline_link_clicks"),
  mobileAppInstall: integer("mobile_app_install"),
  videoPlays: integer("video_plays"),

  websiteCtr: doublePrecision("website_ctr"),
  uniqueCtr: doublePrecision("unique_ctr"),
  estimatedAdRecallers: integer("estimated_ad_recallers"),
  estimatedAdRecallRate: doublePrecision("estimated_ad_recall_rate"),

  actions: jsonb("actions"),
  actionValues: jsonb("action_values"),
  conversions: jsonb("conversions"),
  purchaseRoas: jsonb("purchase_roas"),

  dateStart: date("date_start"),
  dateStop: date("date_stop"),
});
