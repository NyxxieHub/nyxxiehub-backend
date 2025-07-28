import { db } from "../src/index";
import { getAllClientsWithTokens } from "../src/lib/meta-sync/fetch/get-all-clients-with-tokens";
import { fetchCampaigns } from "../src/lib/meta-sync/fetch/fetch-campaigns";
import { insertCampaigns } from "../src/lib/meta-sync/insert/insert-campaigns";
import { adAccounts } from "../src/schemas/meta-api/ad-accounts";
import { eq } from "drizzle-orm";

async function syncCampaigns() {
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

      console.log(
        `🔍 Buscando campanhas para conta ${account.metaAccountId} (client: ${clientId})`
      );

      const campaigns = await fetchCampaigns(
        account.clientId,
        account.metaAccountId
      );

      await insertCampaigns(campaigns);
    }
  }

  console.log("✅ Campanhas sincronizadas com sucesso!");
}

syncCampaigns();
