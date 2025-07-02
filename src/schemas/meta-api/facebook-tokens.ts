import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { client } from "../client/client";

export const facebookTokens = pgTable("facebook_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  token: text("token").notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),

  client_id: uuid("client_id")
    .notNull()
    .references(() => client.id, { onDelete: "cascade" }),

  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  fb_user_id: text("fb_user_id").notNull(),
  access_token: text("access_token").notNull(),
});
