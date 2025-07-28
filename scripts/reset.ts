import { db } from "../src/index";
import { adAccounts } from "../src/schemas/meta-api/ad-accounts";
import { campaigns } from "../src/schemas/meta-api/campaigns";
import { adSets } from "../src/schemas/meta-api/ad-sets";
import { ads } from "../src/schemas/meta-api/ads";
import { adInsights } from "../src/schemas/meta-api/insights/ad_insights";
import { adSetInsights } from "../src/schemas/meta-api/insights/ad_set_insights";
import { campaignInsights } from "../src/schemas/meta-api/insights/campaign_insights";

async function resetMetaTables() {
  console.log("Limpando insights...");
  await db.delete(campaignInsights).execute();
  await db.delete(adSetInsights).execute();
  await db.delete(adInsights).execute();

  console.log("Limpando estrutura de anúncios...");
  await db.delete(ads).execute();
  await db.delete(adSets).execute();
  await db.delete(campaigns).execute();
  await db.delete(adAccounts).execute();

  console.log("✅ Reset completo com sucesso.");
}

resetMetaTables()
  .catch((err) => {
    console.error("Erro ao resetar tabelas:", err);
  })
  .finally(() => process.exit());
