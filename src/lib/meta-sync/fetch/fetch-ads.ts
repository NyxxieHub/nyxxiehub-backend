import { facebookTokens } from "@/schemas";
import { eq } from "drizzle-orm";
import { db } from "@/index";
import { fetchWithToken } from "@/utils/fetch-with-token";

export async function fetchAds(
  clientId: string,
  adSetId: string,
  metaAdSetId: string
) {
  const [tokenRecord] = await db
    .select()
    .from(facebookTokens)
    .where(eq(facebookTokens.client_id, clientId));

  if (!tokenRecord) return [];

  const res = await fetchWithToken(
    `https://graph.facebook.com/v19.0/${metaAdSetId}/ads?fields=name,status,effective_status=["ACTIVE","PAUSED","ARCHIVED"],created_time,updated_time,ad_review_feedback,creative&access_token=${tokenRecord.access_token}`
  );

  return (
    res.data?.map((ad: any) => ({
      ad_set_id: adSetId,
      meta_ad_id: ad.id,
      name: ad.name,
      status: ad.status,
      effective_status: ad.effective_status,
      created_time: ad.created_time,
      updated_time: ad.updated_time ?? null,
      ad_review_feedback: ad.ad_review_feedback ?? null,
      creative: ad.creative ?? null,
    })) ?? []
  );
}
