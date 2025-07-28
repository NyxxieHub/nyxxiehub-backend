import { adSets } from "@/schemas/meta-api/ad-sets";
import { db } from "@/index";
import { MetaAdSet } from "@/lib/meta-sync/types/ad-sets";
import { batchInsert } from "@/lib/meta-sync/utils/batch-insert";
import { campaigns } from "@/schemas/meta-api/campaigns";

export async function insertAdSets(data: MetaAdSet[]) {
  if (!data.length) return;

  const existingCampaigns = await db.query.campaigns.findMany();
  const campaignMap = new Map(
    existingCampaigns.map((c) => [c.metaCampaignId, c.id])
  );

  const parsed = data
    .map((adSet) => {
      const campaignId = campaignMap.get(adSet.campaign_id);

      if (!adSet.ad_account_id || !adSet.id || !campaignId) {
        console.warn("⚠️ Ad set inválido:", {
          id: adSet.id,
          ad_account_id: adSet.ad_account_id,
          campaign_id: adSet.campaign_id,
          motivo: !campaignId
            ? "campanha não encontrada no banco"
            : "dados ausentes",
        });
        return null;
      }

      return {
        adAccountId: adSet.ad_account_id,
        metaAdSetId: adSet.id,
        name: adSet.name,
        status: adSet.status,
        effectiveStatus: adSet.effective_status,
        dailyBudget: adSet.daily_budget ? parseInt(adSet.daily_budget) : null,
        startTime: adSet.start_time ? new Date(adSet.start_time) : null,
        endTime: adSet.end_time ? new Date(adSet.end_time) : null,
        campaignId: campaignId, // UUID real da tabela campaigns
      };
    })
    .filter(Boolean);

  if (!parsed.length) {
    console.log("❌ Nenhum ad set válido para inserir.");
    return;
  }

  try {
    await batchInsert(adSets, parsed);
    console.log("✅ Inserção de ad sets concluída.");
  } catch (err) {
    console.error("💥 Erro na inserção de ad sets:", err);
  }
}
