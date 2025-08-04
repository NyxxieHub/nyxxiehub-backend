import { fetchAdAccounts } from "@/lib/meta-sync/fetch/fetch-ad-accounts";
import { fetchCampaigns } from "@/lib/meta-sync/fetch/fetch-campaigns";
import { fetchAdSets } from "@/lib/meta-sync/fetch/fetch-adsets";
import { fetchAds } from "@/lib/meta-sync/fetch/fetch-ads";

import { insertAdAccounts } from "@/lib/meta-sync/insert/insert-ad-accounts";
import { insertCampaigns } from "@/lib/meta-sync/insert/insert-campaigns";
import { insertAdSets } from "@/lib/meta-sync/insert/insert-ad-sets";
import { insertAds } from "@/lib/meta-sync/insert/insert-ads";

import { db } from "@/index";
import { client } from "@/schemas/client/client";
import { eq } from "drizzle-orm";

export async function syncClientData(clientId: string) {
  const [clientRecord] = await db
    .select()
    .from(client)
    .where(eq(client.id, clientId));

  if (!clientRecord) return;

  const adAccounts = await fetchAdAccounts(clientId);
  await insertAdAccounts(adAccounts);

  for (const adAccount of adAccounts) {
    const adAccountId = adAccount.meta_ad_account_id;

    const campaigns = await fetchCampaigns(clientId, adAccountId);
    await insertCampaigns(campaigns);

    for (const campaign of campaigns) {
      const adSets = await fetchAdSets(clientId, adAccountId);
      await insertAdSets(adSets);

      for (const adSet of adSets) {
        const ads = await fetchAds(clientId, adAccountId, adAccountId);
        await insertAds(ads);
      }
    }
  }

  await db
    .update(client)
    .set({ lastSyncedAt: new Date() })
    .where(eq(client.id, clientId));
}
