import { facebookTokens } from "@/schemas";
import { eq } from "drizzle-orm";
import { db } from "@/index";

export async function fetchCampaigns(clientId: string, adAccountId: string) {
  const [tokenRecord] = await db
    .select()
    .from(facebookTokens)
    .where(eq(facebookTokens.client_id, clientId));

  if (!tokenRecord) return [];

  const url =
    `https://graph.facebook.com/v19.0/act_${adAccountId}/campaigns` +
    `?fields=name,status,effective_status,daily_budget,start_time,end_time,campaign_id` +
    `&access_token=${tokenRecord.access_token}`;

  const res = await fetch(url);
  const json = await res.json();

  if (!json.data) return [];

  return json.data.map((campaign: any) => ({
    meta_campaign_id: campaign.id,
    ad_account_id: adAccountId,
    name: campaign.name,
    status: campaign.status,
    effective_status: campaign.effective_status,
    objective: campaign.objective,
    created_time: campaign.created_time,
    updated_time: campaign.updated_time,
    start_time: campaign.start_time,
    stop_time: campaign.stop_time,
  }));
}
