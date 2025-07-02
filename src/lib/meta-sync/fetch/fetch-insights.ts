import { fetchWithToken } from "@/utils/fetch-with-token";
import { db } from "@/index";
import { facebookTokens } from "@/schemas";
import { eq } from "drizzle-orm";

const insightsFields = [
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
  "conversions",
  "purchase_roas",
  "inline_link_clicks",
  "mobile_app_install",
  "video_plays",
  "website_ctr",
  "unique_ctr",
  "estimated_ad_recallers",
  "estimated_ad_recall_rate",
  "date_start",
  "date_stop",
].join(",");

export async function fetchInsights(
  clientId: string,
  metaId: string,
  level: "campaign" | "adset" | "ad"
) {
  const [tokenRecord] = await db
    .select()
    .from(facebookTokens)
    .where(eq(facebookTokens.client_id, clientId));

  if (!tokenRecord) return null;

  const url = `https://graph.facebook.com/v19.0/${metaId}/insights?fields=${insightsFields}&access_token=${tokenRecord.access_token}&date_preset=last_30d&level=${level}`;

  const res = await fetchWithToken(url);

  return res.data?.[0] ?? null;
}
