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

import { adAccounts as adAccountsTable } from "@/schemas";
import { db } from "@/index";
import { eq } from "drizzle-orm";

interface Campaign {
  meta_campaign_id: string;
  name: string;
  ad_account_id: string;
}

export async function syncClientData(clientId: string) {
  const adAccounts = await fetchAdAccounts(clientId);
  await insertAdAccounts(adAccounts);

  for (const adAccount of adAccounts) {
    // pega o ad account salvo no banco pra obter o UUID real
    const [dbAdAccount] = await db
      .select()
      .from(adAccountsTable)
      .where(eq(adAccountsTable.metaAccountId, adAccount.meta_ad_account_id));

    if (!dbAdAccount) continue;

    const campaigns = await fetchCampaigns(
      clientId,
      adAccount.meta_ad_account_id
    );

    const campaignsWithDbId = campaigns.map((c: Campaign) => ({
      ...c,
      ad_account_id: dbAdAccount.id,
    }));
    await insertCampaigns(campaignsWithDbId);

    for (const campaign of campaignsWithDbId) {
      const adsets = await fetchAdSets(
        clientId,
        campaign.ad_account_id,
        campaign.meta_campaign_id
      );
      await insertAdSets(adsets);

      for (const adset of adsets) {
        const ads = await fetchAds(clientId, adset.id, adset.meta_ad_set_id);
        await insertAds(ads);

        const adsetInsight = await fetchInsights(
          clientId,
          adset.meta_ad_set_id,
          "adset"
        );
        if (adsetInsight) {
          await insertAdSetInsights([{ ...adsetInsight, ad_set_id: adset.id }]);
        }

        for (const ad of ads) {
          const adInsight = await fetchInsights(clientId, ad.meta_ad_id, "ad");
          if (adInsight) {
            await insertAdInsights([{ ...adInsight, ad_id: ad.id }]);
          }
        }
      }

      const campaignInsight = await fetchInsights(
        clientId,
        campaign.meta_campaign_id,
        "campaign"
      );
      if (campaignInsight) {
        await insertCampaignInsights([
          { ...campaignInsight, campaign_id: campaign.id },
        ]);
      }
    }
  }
}
