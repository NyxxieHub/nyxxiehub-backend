import { facebookTokens } from "@/schemas";
import { eq } from "drizzle-orm";
import { db } from "@/index";
import { fetchWithToken } from "@/utils/fetch-with-token";

export async function fetchAdAccounts(clientId: string) {
  const [tokenRecord] = await db
    .select()
    .from(facebookTokens)
    .where(eq(facebookTokens.client_id, clientId));

  if (!tokenRecord) return [];

  console.log("Token usado:", tokenRecord.access_token);

  const res = await fetchWithToken(
    `https://graph.facebook.com/v19.0/me/adaccounts?fields=name,account_status,account_id,currency,time_zone_name&access_token=${tokenRecord.access_token}`
  );

  console.log("Resposta do Facebook:", res);

  return (
    res.data?.map((account: any) => ({
      client_id: clientId,
      meta_ad_account_id: account.account_id,
      name: account.name,
      status: account.account_status.toString(),
      currency: account.currency,
      timezone: account.time_zone_name ?? "America/Sao_Paulo",
    })) ?? []
  );
}
