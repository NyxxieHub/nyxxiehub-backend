import { db } from "../src/index";
import { getAllClientsWithTokens } from "../src/lib/meta-sync/fetch/get-all-clients-with-tokens";
import { fetchAds } from "../src/lib/meta-sync/fetch/fetch-ads";
import { insertAds } from "../src/lib/meta-sync/insert/insert-ads";
import { adAccounts } from "../src/schemas/meta-api/ad-accounts";
import { eq } from "drizzle-orm";

async function syncAds() {
  const clients = await getAllClientsWithTokens();

  for (const { clientId } of clients) {
    const accounts = await db
      .select()
      .from(adAccounts)
      .where(eq(adAccounts.clientId, clientId));

    for (const account of accounts) {
      if (!account.metaAccountId) {
        console.warn(`⚠️ Ad account sem metaAccountId: ${account.id}`);
        continue;
      }

      const ads = await fetchAds(clientId, account.id, account.metaAccountId);
      await insertAds(ads);
    }
  }

  console.log("✅ Anúncios sincronizados com sucesso!");
}

syncAds();
