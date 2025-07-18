import { facebookTokens } from "@/schemas";
import { eq } from "drizzle-orm";
import { db } from "@/index";
import { fetchWithToken } from "@/utils/fetch-with-token";

export async function fetchAdSets(
  clientId: string,
  adAccountId: string,
  metaAdAccountId: string
) {
  const [tokenRecord] = await db
    .select()
    .from(facebookTokens)
    .where(eq(facebookTokens.client_id, clientId));

  if (!tokenRecord) return [];

  const res = await fetchWithToken(
    `https://graph.facebook.com/v19.0/act_${metaAdAccountId}/adsets?fields=name,status,effective_status,daily_budget,start_time,end_time,campaign_id&access_token=${tokenRecord.access_token}`
  );

  return (
    res.data?.map((adSet: any) => ({
      client_id: clientId,
      ad_account_id: adAccountId,
      meta_ad_set_id: adSet.id,
      name: adSet.name,
      status: adSet.status,
      effective_status: adSet.effective_status,
      daily_budget: adSet.daily_budget ? parseInt(adSet.daily_budget) : null,
      start_time: adSet.start_time ? new Date(adSet.start_time) : null,
      end_time: adSet.end_time ? new Date(adSet.end_time) : null,
      meta_campaign_id: adSet.campaign_id,
    })) ?? []
  );
}
