import { db } from "@/index";
import { ads } from "@/schemas/meta-api/ads";
import { adSets } from "@/schemas/meta-api/ad-sets";
import { batchInsert } from "@/lib/meta-sync/utils/batch-insert";
import { MetaAd } from "@/lib/meta-sync/types/ad";

export async function insertAds(data: MetaAd[]) {
  if (!data.length) return;

  const existingAdSets = await db.query.adSets.findMany();
  const adSetMap = new Map(existingAdSets.map((a) => [a.metaAdSetId, a.id]));

  const parsed = data
    .map((ad) => {
      const adSetId = adSetMap.get(ad.adset_id);

      if (!ad.id || !ad.ad_account_id || !adSetId) {
        console.warn(
          `⚠️ Anúncio inválido: ${JSON.stringify({
            id: ad.id,
            ad_account_id: ad.ad_account_id,
            adset_id: ad.adset_id,
            motivo: "conjunto não encontrado no banco",
          })}`
        );
        return null;
      }

      return {
        adSetId: adSetId,
        metaAdId: ad.id,
        name: ad.name,
        status: ad.status,
        effectiveStatus: ad.effective_status,
        createdTime: new Date(ad.created_time),
      };
    })
    .filter(Boolean);

  if (!parsed.length) {
    console.log("❌ Nenhum anúncio válido para inserir.");
    return;
  }

  try {
    await batchInsert(ads, parsed);
    console.log("✅ Inserção de anúncios concluída.");
  } catch (err) {
    console.error("💥 Erro na inserção de anúncios:", err);
  }
}
