import { fetchAdAccounts } from "@/lib/meta-sync/fetch/fetch-ad-accounts";
import { fetchCampaigns } from "@/lib/meta-sync/fetch/fetch-campaigns";
import { fetchAdSets } from "@/lib/meta-sync/fetch/fetch-adsets";
import { fetchAds } from "@/lib/meta-sync/fetch/fetch-ads";
import { fetchInsights } from "@/lib/meta-sync/fetch/fetch-insights";

import { insertAdAccounts } from "@/lib/meta-sync/insert/insert-ad-accounts";
import { insertCampaigns } from "@/lib/meta-sync/insert/insert-campaigns";
import { insertAdSets } from "@/lib/meta-sync/insert/insert-ad-sets";
import { insertAds } from "@/lib/meta-sync/insert/insert-ads";

import { insertCampaignInsights } from "@/lib/meta-sync/insert/insights/insert-campaign-insights";
import { insertAdSetInsights } from "@/lib/meta-sync/insert/insights/insert-adset-insights";
import { insertAdInsights } from "@/lib/meta-sync/insert/insights/insert-ad-insights";

import { db } from "@/index";
import { client } from "@/schemas/client/client";
import { eq } from "drizzle-orm";

export async function syncClientData(clientId: string) {
  // Step 1: Ad Accounts
  const adAccounts = await fetchAdAccounts(clientId);
  await insertAdAccounts(adAccounts);

  for (const adAccount of adAccounts) {
    const adAccountId = adAccount.meta_ad_account_id;

    // Step 2: Campaigns
    const campaigns = await fetchCampaigns(clientId, adAccountId);
    await insertCampaigns(campaigns);

    for (const campaign of campaigns) {
      // Step 3: Ad Sets
      const adSets = await fetchAdSets(clientId, adAccountId);
      await insertAdSets(adSets);

      for (const adSet of adSets) {
        const adSetId = adSet.ad_account_id;

        // Step 4: Ads
        const ads = await fetchAds(clientId, adSetId, adAccountId);
        await insertAds(ads);

        // // Step 5: Ad Insights
        // const adInsights = await fetchInsights("ad", ads);
        // await insertAdInsights(adInsights);
      }

      //   // Step 6: Ad Set Insights
      //   const adSetInsights = await fetchInsights("ad_set", adSets);
      //   await insertAdSetInsights(adSetInsights);
    }

    // // Step 7: Campaign Insights
    // const campaignInsights = await fetchInsights("campaign", campaigns);
    // await insertCampaignInsights(campaignInsights);
  }

  // Atualiza lastSyncedAt
  await db
    .update(client)
    .set({ lastSyncedAt: new Date() })
    .where(eq(client.id, clientId));
}
