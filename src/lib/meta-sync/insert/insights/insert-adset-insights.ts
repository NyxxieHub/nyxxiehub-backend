import { db } from "@/index";
import { adSetInsights } from "@/schemas";
import { eq } from "drizzle-orm";

interface AdSetInsightInput {
  id: string;
  ad_set_id: string;
  impressions?: number;
  reach?: number;
  frequency?: number;
  clicks?: number;
  unique_clicks?: number;
  cpc?: number;
  ctr?: number;
  spend?: number;
  cpm?: number;
  cpp?: number;
  cost_per_inline_link_click?: number;
  actions?: any;
  action_values?: any;
  conversions?: any;
  purchase_roas?: any;
  inline_link_clicks?: number;
  mobile_app_install?: number;
  video_plays?: number;
  website_ctr?: number;
  unique_ctr?: number;
  estimated_ad_recallers?: number;
  estimated_ad_recall_rate?: number;
  date_start?: string;
  date_stop?: string;
}

export async function insertAdSetInsights(insights: AdSetInsightInput[]) {
  for (const insight of insights) {
    const existing = await db
      .select()
      .from(adSetInsights)
      .where(eq(adSetInsights.id, insight.id));

    const data = {
      adSetId: insight.ad_set_id,
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
      actions: insight.actions ?? null,
      actionValues: insight.action_values ?? null,
      conversions: insight.conversions ?? null,
      purchaseRoas: insight.purchase_roas ?? null,
      inlineLinkClicks: insight.inline_link_clicks ?? null,
      websiteCtr: insight.website_ctr ?? null,
      uniqueCtr: insight.unique_ctr ?? null,
      estimatedAdRecallers: insight.estimated_ad_recallers ?? null,
      estimatedAdRecallRate: insight.estimated_ad_recall_rate ?? null,
      dateStart: insight.date_start ?? null,
      dateStop: insight.date_stop ?? null,
    };

    if (existing.length > 0) {
      await db
        .update(adSetInsights)
        .set(data)
        .where(eq(adSetInsights.id, insight.id));
    } else {
      await db.insert(adSetInsights).values({ id: insight.id, ...data });
    }
  }
}
