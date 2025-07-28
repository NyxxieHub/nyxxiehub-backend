import { db } from "@/index";
import { campaigns } from "@/schemas/meta-api/campaigns";
import { CampaignInput } from "@/lib/meta-sync/types/campaign";
import { batchInsert } from "@/lib/meta-sync/utils/batch-insert";

export async function insertCampaigns(data: CampaignInput[]) {
  if (!data.length) return;

  const adAccountsFromDb = await db.query.adAccounts.findMany();
  const adAccountMap = new Map(
    adAccountsFromDb.map((acc) => [acc.metaAccountId, acc.id])
  );

  const parsed = data
    .map((campaign) => {
      const internalAdAccountId = adAccountMap.get(campaign.ad_account_id);

      if (!internalAdAccountId) {
        console.warn(
          `⚠️ Ad account ${campaign.ad_account_id} não encontrado no banco, pulando campanha "${campaign.name}"`
        );
        return null;
      }

      return {
        adAccountId: internalAdAccountId,
        metaCampaignId: campaign.meta_campaign_id,
        name: campaign.name,
        status: campaign.status,
        objective: campaign.objective,
        startTime: campaign.start_time ? new Date(campaign.start_time) : null,
        stopTime: campaign.stop_time ? new Date(campaign.stop_time) : null,
        createdTime: new Date(campaign.created_time),
        updatedTime: campaign.updated_time
          ? new Date(campaign.updated_time)
          : null,
        effectiveStatus: campaign.effective_status,
      };
    })
    .filter(Boolean);

  if (!parsed.length) {
    console.log("❌ Nenhuma campanha válida para inserir.");
    return;
  }
  console.log(parsed);
  try {
    await batchInsert(campaigns, parsed);
    console.log("✅ Inserção de campanhas concluída.");
  } catch (err) {
    console.error("💥 Erro na inserção de campanhas:", err);
  }
}
