import { relations } from "drizzle-orm";
import { adAccounts } from "./ad-accounts";
import { campaigns } from "./campaigns";
import { adSets } from "./ad-sets";
import { ads } from "./ads";

import { client } from "../client/client";

// 📦 ad_accounts → client
export const adAccountsRelations = relations(adAccounts, ({ one, many }) => ({
  client: one(client, {
    fields: [adAccounts.clientId],
    references: [client.id],
  }),
  campaigns: many(campaigns),
}));

// 🎯 campaigns → ad_account
export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  adAccount: one(adAccounts, {
    fields: [campaigns.adAccountId],
    references: [adAccounts.id],
  }),
  adSets: many(adSets),
}));

// 📚 ad_sets → campaign
export const adSetsRelations = relations(adSets, ({ one, many }) => ({
  campaign: one(campaigns, {
    fields: [adSets.campaignId],
    references: [campaigns.id],
  }),
  ads: many(ads),
}));

// 🎨 ads → ad_set
export const adsRelations = relations(ads, ({ one }) => ({
  adSet: one(adSets, {
    fields: [ads.adSetId],
    references: [adSets.id],
  }),
}));
