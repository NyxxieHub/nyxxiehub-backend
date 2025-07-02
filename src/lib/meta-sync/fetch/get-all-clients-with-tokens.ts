import { db } from "@/index";
import { facebookTokens } from "@/schemas";

export async function getAllClientsWithTokens() {
  const tokens = await db.select().from(facebookTokens);
  return tokens.map((t) => ({
    clientId: t.client_id,
    accessToken: t.access_token,
  }));
}
