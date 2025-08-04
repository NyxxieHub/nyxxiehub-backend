import { db } from "@/index";
import { facebookTokens } from "@/schemas";
import { eq } from "drizzle-orm";
import { fetchAllPaginated } from "../../utils/fetch-all-paginated";
import { getInsightsTimeRange } from "@/utils/get-insights-time-range";

type RawInsight = {
  date_start: string;
  date_stop: string;

  impressions?: string;
  reach?: string;
  frequency?: string;
  clicks?: string;
  unique_clicks?: string;
  cpc?: string;
  ctr?: string;
  spend?: string;
  cpm?: string;
  cpp?: string;
  cost_per_inline_link_click?: string;

  actions?: any[];
  action_values?: any[];
  cost_per_action_type?: any[];

  conversions?: any[];
  purchase_roas?: any[];
  inline_link_clicks?: string;

  website_ctr?: string;
  unique_ctr?: string;
  estimated_ad_recallers?: string;
  estimated_ad_recall_rate?: string;
};

export async function fetchAdInsights(
  clientId: string,
  adId: string,
  lastSyncedAt: Date | null
) {
  const [tokenRecord] = await db
    .select()
    .from(facebookTokens)
    .where(eq(facebookTokens.client_id, clientId));

  if (!tokenRecord) return [];

  const { since, until } = getInsightsTimeRange(lastSyncedAt);

  const fields = [
    "date_start",
    "date_stop",
    "impressions",
    "reach",
    "frequency",
    "clicks",
    "unique_clicks",
    "cpc",
    "ctr",
    "spend",
    "cpm",
    "cpp",
    "cost_per_inline_link_click",

    "actions",
    "action_values",
    "cost_per_action_type",

    "conversions",
    "purchase_roas",
    "inline_link_clicks",

    "website_ctr",
    "unique_ctr",
    "estimated_ad_recallers",
    "estimated_ad_recall_rate",
  ].join(",");

  const url = `https://graph.facebook.com/v19.0/act_${adId}/insights?fields=${fields}&time_range[since]=${since}&time_range[until]=${until}&time_increment=1&limit=25&access_token=${tokenRecord.access_token}`;
  console.log("🔍 URL final da API:", url);
  const insights = await fetchAllPaginated<RawInsight>(
    url,
    tokenRecord.access_token
  );

  return insights.map((insight) => ({
    adId,
    dateStart: new Date(insight.date_start),
    dateStop: new Date(insight.date_stop),

    impressions: parseInt(insight.impressions ?? "0"),
    reach: parseInt(insight.reach ?? "0"),
    frequency: parseFloat(insight.frequency ?? "0"),
    clicks: parseInt(insight.clicks ?? "0"),
    uniqueClicks: parseInt(insight.unique_clicks ?? "0"),
    cpc: parseFloat(insight.cpc ?? "0"),
    ctr: parseFloat(insight.ctr ?? "0"),
    spend: parseFloat(insight.spend ?? "0"),
    cpm: parseFloat(insight.cpm ?? "0"),
    cpp: parseFloat(insight.cpp ?? "0"),
    costPerInlineLinkClick: parseFloat(
      insight.cost_per_inline_link_click ?? "0"
    ),

    actions: insight.actions ?? null,
    actionValues: insight.action_values ?? null,
    costPerActionType: insight.cost_per_action_type ?? null,

    conversions: insight.conversions ?? null,
    purchaseRoas: insight.purchase_roas ?? null,
    inlineLinkClicks: parseInt(insight.inline_link_clicks ?? "0"),

    websiteCtr: parseFloat(insight.website_ctr ?? "0"),
    uniqueCtr: parseFloat(insight.unique_ctr ?? "0"),
    estimatedAdRecallers: parseInt(insight.estimated_ad_recallers ?? "0"),
    estimatedAdRecallRate: parseFloat(insight.estimated_ad_recall_rate ?? "0"),
  }));
}
