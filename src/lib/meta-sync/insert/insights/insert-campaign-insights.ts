import { db } from "@/index";
import { campaignInsights } from "@/schemas";
import { batchInsert } from "@/lib/meta-sync/utils/batch-insert";

export async function insertCampaignInsights(data: any[]) {
  if (!data.length) return;

  const campaignsFromDb = await db.query.campaigns.findMany();
  const campaignMap = new Map(
    campaignsFromDb.map((c) => [c.metaCampaignId, c.id])
  );

  const parsed = data
    .map((insight) => {
      const internalCampaignId = campaignMap.get(insight.campaignId);
      if (!internalCampaignId) {
        console.warn(
          `⚠️ Campanha ${insight.campaignId} não encontrada, pulando insight.`
        );
        return null;
      }

      return {
        campaignId: internalCampaignId,
        ...insight,
      };
    })
    .filter(Boolean);

  if (!parsed.length) {
    console.log("❌ Nenhum insight de campanha válido para inserir.");
    return;
  }

  try {
    await batchInsert(campaignInsights, parsed);
    console.log("✅ Inserção de insights de campanhas concluída.");
  } catch (err) {
    console.error("💥 Erro na inserção de insights de campanhas:", err);
  }
}
