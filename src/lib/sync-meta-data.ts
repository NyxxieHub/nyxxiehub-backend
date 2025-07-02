import { getAllClientsWithTokens } from "@/lib/meta-sync/fetch/get-all-clients-with-tokens";
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

export async function syncMetaData() {
  const clients = await getAllClientsWithTokens();

  for (const client of clients) {
    try {
      const adAccounts = await fetchAdAccounts(client.clientId);
      await insertAdAccounts(adAccounts);

      for (const adAccount of adAccounts) {
        const fetchedCampaigns = await fetchCampaigns(
          client.clientId,
          adAccount.meta_ad_account_id
        );
        await insertCampaigns(fetchedCampaigns);

        for (const campaign of fetchedCampaigns) {
          const fetchedAdSets = await fetchAdSets(
            client.clientId,
            campaign.ad_account_id,
            campaign.meta_campaign_id
          );
          await insertAdSets(fetchedAdSets);

          for (const adSet of fetchedAdSets) {
            const fetchedAds = await fetchAds(
              client.clientId,
              adSet.id,
              adSet.meta_ad_set_id
            );
            await insertAds(fetchedAds);

            // 🔍 Insights de ad sets
            const adSetInsight = await fetchInsights(
              client.clientId,
              adSet.meta_ad_set_id,
              "adset"
            );
            if (adSetInsight) {
              await insertAdSetInsights([
                {
                  id: `${adSet.meta_ad_set_id}-${adSetInsight.date_start}`,
                  ad_set_id: adSet.id,
                  impressions: adSetInsight.impressions ?? null,
                  reach: adSetInsight.reach ?? null,
                  frequency: adSetInsight.frequency ?? null,
                  clicks: adSetInsight.clicks ?? null,
                  unique_clicks: adSetInsight.unique_clicks ?? null,
                  cpc: adSetInsight.cpc ?? null,
                  ctr: adSetInsight.ctr ?? null,
                  spend: adSetInsight.spend ?? null,
                  cpm: adSetInsight.cpm ?? null,
                  cpp: adSetInsight.cpp ?? null,
                  cost_per_inline_link_click:
                    adSetInsight.cost_per_inline_link_click ?? null,
                  actions: adSetInsight.actions ?? null,
                  action_values: adSetInsight.action_values ?? null,
                  conversions: adSetInsight.conversions ?? null,
                  purchase_roas: adSetInsight.purchase_roas ?? null,
                  inline_link_clicks: adSetInsight.inline_link_clicks ?? null,
                  mobile_app_install: adSetInsight.mobile_app_install ?? null,
                  video_plays: adSetInsight.video_plays ?? null,
                  website_ctr: adSetInsight.website_ctr ?? null,
                  unique_ctr: adSetInsight.unique_ctr ?? null,
                  estimated_ad_recallers:
                    adSetInsight.estimated_ad_recallers ?? null,
                  estimated_ad_recall_rate:
                    adSetInsight.estimated_ad_recall_rate ?? null,
                  date_start: adSetInsight.date_start ?? null,
                  date_stop: adSetInsight.date_stop ?? null,
                },
              ]);
            }

            // 🔍 Insights de ads
            for (const ad of fetchedAds) {
              const adInsight = await fetchInsights(
                client.clientId,
                ad.meta_ad_id,
                "ad"
              );
              if (adInsight) {
                await insertAdInsights([
                  {
                    ...adInsight,
                    ad_id: ad.id,
                  },
                ]);
              }
            }
          }

          // 🔍 Insights de campanhas
          const campaignInsight = await fetchInsights(
            client.clientId,
            campaign.meta_campaign_id,
            "campaign"
          );
          if (campaignInsight) {
            await insertCampaignInsights([
              {
                id: `${campaign.meta_campaign_id}-${campaignInsight.date_start}`,
                campaign_id: campaign.id,
                impressions: campaignInsight.impressions ?? null,
                reach: campaignInsight.reach ?? null,
                frequency: campaignInsight.frequency ?? null,
                clicks: campaignInsight.clicks ?? null,
                unique_clicks: campaignInsight.unique_clicks ?? null,
                cpc: campaignInsight.cpc ?? null,
                ctr: campaignInsight.ctr ?? null,
                spend: campaignInsight.spend ?? null,
                cpm: campaignInsight.cpm ?? null,
                cpp: campaignInsight.cpp ?? null,
                cost_per_inline_link_click:
                  campaignInsight.cost_per_inline_link_click ?? null,
                actions: campaignInsight.actions ?? null,
                action_values: campaignInsight.action_values ?? null,
                conversions: campaignInsight.conversions ?? null,
                purchase_roas: campaignInsight.purchase_roas ?? null,
                inline_link_clicks: campaignInsight.inline_link_clicks ?? null,
                mobile_app_install: campaignInsight.mobile_app_install ?? null,
                video_plays: campaignInsight.video_plays ?? null,
                website_ctr: campaignInsight.website_ctr ?? null,
                unique_ctr: campaignInsight.unique_ctr ?? null,
                estimated_ad_recallers:
                  campaignInsight.estimated_ad_recallers ?? null,
                estimated_ad_recall_rate:
                  campaignInsight.estimated_ad_recall_rate ?? null,
                date_start: campaignInsight.date_start ?? null,
                date_stop: campaignInsight.date_stop ?? null,
              },
            ]);
          }
        }
      }
    } catch (err) {
      console.error(
        "Erro ao sincronizar dados do client:",
        client.clientId,
        err
      );
    }
  }
}
