import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { adSets } from "./ad-sets";

export const ads = pgTable("ads", {
  id: uuid("id").defaultRandom().primaryKey(),

  adSetId: uuid("ad_set_id")
    .notNull()
    .references(() => adSets.id, { onDelete: "cascade" }),

  metaAdId: text("meta_ad_id").notNull().unique(),
  name: text("name").notNull(),
  status: text("status").notNull(), // ACTIVE, PAUSED, etc
  effectiveStatus: text("effective_status").notNull(),
  createdTime: timestamp("created_time").notNull(),
  updatedTime: timestamp("updated_time"),
  adReviewFeedback: jsonb("ad_review_feedback"), // pode vir com motivos de reprovação
  creative: jsonb("creative"), // dados da imagem, vídeo, link, etc
});
