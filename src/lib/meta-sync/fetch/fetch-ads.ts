import { db } from "@/index";
import { facebookTokens } from "@/schemas";
import { eq } from "drizzle-orm";
import { fetchAllPaginated } from "../utils/fetch-all-paginated";
import { MetaAd } from "@/lib/meta-sync/types/ad";

export async function fetchAds(
  clientId: string,
  adAccountId: string,
  metaAdAccountId: string
): Promise<MetaAd[]> {
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
    "adset_id",
    "created_time",
  ].join(",");

  const url = `https://graph.facebook.com/v19.0/act_${metaAdAccountId}/ads?fields=${fields}&limit=25&access_token=${tokenRecord.access_token}`;

  const ads = await fetchAllPaginated<MetaAd>(url, tokenRecord.access_token);

  return (
    ads.map((ad: any) => ({
      id: ad.id,
      name: ad.name,
      status: ad.status,
      effective_status: ad.effective_status,
      adset_id: ad.adset_id,
      ad_account_id: adAccountId,
      created_time: ad.created_time,
    })) ?? []
  );
}
