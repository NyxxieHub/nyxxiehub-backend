import { facebookTokens } from "@/schemas";
import { eq } from "drizzle-orm";
import { db } from "@/index";
import { fetchAllPaginated } from "../utils/fetch-all-paginated";
import { MetaCampaign } from "@/lib/meta-sync/types/campaign";

export async function fetchCampaigns(clientId: string, adAccountId: string) {
  const [tokenRecord] = await db
    .select()
    .from(facebookTokens)
    .where(eq(facebookTokens.client_id, clientId));

  if (!tokenRecord) return [];

  const fields = [
    "id",
    "name",
    "status",
    "effective_status",
    "objective",
    "created_time",
    "updated_time",
    "start_time",
    "stop_time",
  ].join(",");

  const url = `https://graph.facebook.com/v19.0/act_${adAccountId}/campaigns?fields=${fields}&limit=25&access_token=${tokenRecord.access_token}`;

  const campaigns = await fetchAllPaginated<MetaCampaign>(
    url,
    tokenRecord.access_token
  );

  return campaigns.map((campaign) => ({
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
