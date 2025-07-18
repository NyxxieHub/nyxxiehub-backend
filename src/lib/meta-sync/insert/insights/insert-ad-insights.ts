import { db } from "@/index";
import { adInsights } from "@/schemas";
import { eq } from "drizzle-orm";

interface AdInsightInput {
  ad_id: string;
  impressions?: number | null;
  reach?: number | null;
  frequency?: number | null;
  clicks?: number | null;
  unique_clicks?: number | null;
  cpc?: number | null;
  ctr?: number | null;
  spend?: number | null;
  cpm?: number | null;
  cpp?: number | null;
  cost_per_inline_link_click?: number | null;
  cost_per_action_type?: number | null;
  inline_link_clicks?: number | null;
  mobile_app_install?: number | null;
  video_plays?: number | null;
  website_ctr?: number | null;
  unique_ctr?: number | null;
  estimated_ad_recallers?: number | null;
  estimated_ad_recall_rate?: number | null;
  actions?: unknown;
  action_values?: unknown;
  conversions?: unknown;
  purchase_roas?: unknown;
  date_start?: string | null;
  date_stop?: string | null;
}

export async function insertAdInsights(insightList: AdInsightInput[]) {
  for (const insight of insightList) {
    const existing = await db
      .select()
      .from(adInsights)
      .where(eq(adInsights.adId, insight.ad_id));

    const values = {
      adId: insight.ad_id,
      impressions: insight.impressions ?? null,
      reach: insight.reach ?? null,
      frequency: insight.frequency ?? null,
      clicks: insight.clicks ?? null,
      uniqueClicks: insight.unique_clicks ?? null,
      cpc: insight.cpc ?? null,
      ctr: insight.ctr ?? null,
      spend: insight.spend ?? null,
      cpm: insight.cpm ?? null,
      cpp: insight.cpp ?? null,
      costPerInlineLinkClick: insight.cost_per_inline_link_click ?? null,
      costPerActionType: insight.cost_per_action_type ?? [],
      inlineLinkClicks: insight.inline_link_clicks ?? null,
      websiteCtr: insight.website_ctr ?? null,
      uniqueCtr: insight.unique_ctr ?? null,
      estimatedAdRecallers: insight.estimated_ad_recallers ?? null,
      estimatedAdRecallRate: insight.estimated_ad_recall_rate ?? null,
      actions: insight.actions ?? null,
      actionValues: insight.action_values ?? null,
      conversions: insight.conversions ?? null,
      purchaseRoas: insight.purchase_roas ?? null,
      dateStart: insight.date_start ?? null,
      dateStop: insight.date_stop ?? null,
    };

    if (existing.length > 0) {
      await db
        .update(adInsights)
        .set(values)
        .where(eq(adInsights.adId, insight.ad_id));
    } else {
      await db.insert(adInsights).values(values);
    }
  }
}
