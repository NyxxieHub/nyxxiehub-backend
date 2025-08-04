import { db } from "@/index";
import { eq, inArray } from "drizzle-orm";
import { client } from "@/schemas/client/client";
import { adAccounts } from "@/schemas/meta-api/ad-accounts";
import { campaigns } from "@/schemas/meta-api/campaigns";
import { adSets } from "@/schemas/meta-api/ad-sets";
import { ads } from "@/schemas/meta-api/ads";

import { fetchCampaignInsights } from "@/lib/meta-sync/fetch/insights/fetch-campaign-insights";
import { fetchAdSetInsights } from "@/lib/meta-sync/fetch/insights/fetch-adset-insights";
import { fetchAdInsights } from "@/lib/meta-sync/fetch/insights/fetch-ad-insights";

import { insertCampaignInsights } from "@/lib/meta-sync/insert/insights/insert-campaign-insights";
import { insertAdSetInsights } from "@/lib/meta-sync/insert/insights/insert-adset-insights";
import { insertAdInsights } from "@/lib/meta-sync/insert/insights/insert-ad-insights";

import pLimit from "p-limit";

export async function syncClientInsights(clientId: string) {
  const [clientRecord] = await db
    .select()
    .from(client)
    .where(eq(client.id, clientId));

  if (!clientRecord) return;

  const lastSyncedAt = clientRecord.lastSyncedAt ?? null;

  const limit = pLimit(3); // até 3 requisições em paralelo

  // 1. Buscar os adAccounts do cliente
  const adAccountsFromDb = await db
    .select()
    .from(adAccounts)
    .where(eq(adAccounts.clientId, clientId));

  const adAccountIds = adAccountsFromDb.map((a) => a.id);
  if (!adAccountIds.length) return;

  // 2. Buscar campanhas vinculadas
  const campaignsFromDb = await db
    .select()
    .from(campaigns)
    .where(inArray(campaigns.adAccountId, adAccountIds));

  const campaignInsightResults = await Promise.allSettled(
    campaignsFromDb.map((campaign) =>
      limit(async () => {
        const insights = await fetchCampaignInsights(
          clientId,
          campaign.metaCampaignId,
          lastSyncedAt
        );
        await insertCampaignInsights(insights);
      })
    )
  );
  console.log("✅ Sync de insights de campanhas finalizado.");

  // 3. Buscar adSets das campanhas encontradas
  const campaignIds = campaignsFromDb.map((c) => c.id);
  const adSetsFromDb = await db
    .select()
    .from(adSets)
    .where(inArray(adSets.campaignId, campaignIds));

  const adSetInsightResults = await Promise.allSettled(
    adSetsFromDb.map((adSet) =>
      limit(async () => {
        const insights = await fetchAdSetInsights(
          clientId,
          adSet.metaAdSetId,
          lastSyncedAt
        );
        await insertAdSetInsights(insights);
      })
    )
  );
  console.log("✅ Sync de insights de ad sets finalizado.");

  // 4. Buscar ads dos adSets encontrados
  const adSetIds = adSetsFromDb.map((a) => a.id);
  const adsFromDb = await db
    .select()
    .from(ads)
    .where(inArray(ads.adSetId, adSetIds));

  const adInsightResults = await Promise.allSettled(
    adsFromDb.map((ad) =>
      limit(async () => {
        const insights = await fetchAdInsights(
          clientId,
          ad.metaAdId,
          lastSyncedAt
        );
        await insertAdInsights(insights);
      })
    )
  );
  console.log("✅ Sync de insights de anúncios finalizado.");
}
