import { db } from "@/index";
import { facebookTokens } from "@/schemas";
import { eq } from "drizzle-orm";
import { fetchAllPaginated } from "../utils/fetch-all-paginated";
import { MetaAdSet } from "@/lib/meta-sync/types/ad-sets";

export async function fetchAdSets(clientId: string, adAccountId: string) {
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
    "daily_budget",
    "start_time",
    "end_time",
    "campaign_id",
  ].join(",");

  const url = `https://graph.facebook.com/v19.0/act_${adAccountId}/adsets?fields=${fields}&limit=25&access_token=${tokenRecord.access_token}`;

  const adSets = await fetchAllPaginated<MetaAdSet>(
    url,
    tokenRecord.access_token
  );

  return (
    adSets.map((adSet: any) => ({
      id: adSet.id,
      ad_account_id: adAccountId,
      name: adSet.name,
      status: adSet.status,
      effective_status: adSet.effective_status,
      daily_budget: adSet.daily_budget,
      start_time: adSet.start_time,
      end_time: adSet.end_time,
      campaign_id: adSet.campaign_id,
    })) ?? []
  );
}
