import { db } from "../src/index";
import { getAllClientsWithTokens } from "../src/lib/meta-sync/fetch/get-all-clients-with-tokens";
import { fetchAdSets } from "../src/lib/meta-sync/fetch/fetch-adsets";
import { insertAdSets } from "../src/lib/meta-sync/insert/insert-ad-sets";
import { eq } from "drizzle-orm";
import { adAccounts } from "../src/schemas";

async function syncAdSets() {
  const clients = await getAllClientsWithTokens();

  for (const { clientId } of clients) {
    const adAccountsInDb = await db
      .select()
      .from(adAccounts)
      .where(eq(adAccounts.clientId, clientId));

    for (const account of adAccountsInDb) {
      if (!account.metaAccountId) {
        console.warn(`⚠️ Ad account com ID ${account.id} sem metaAccountId`);
        continue;
      }

      const adSets = await fetchAdSets(clientId, account.id);

      await insertAdSets(adSets);
    }
  }

  console.log("✅ Ad sets sincronizados com sucesso!");
}

syncAdSets();
