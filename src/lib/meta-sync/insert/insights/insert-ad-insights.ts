import { db } from "@/index";
import { adInsights, ads } from "@/schemas";
import { batchInsert } from "@/lib/meta-sync/utils/batch-insert";

export async function insertAdInsights(data: any[]) {
  if (!data.length) return;

  const adsFromDb = await db.query.ads.findMany();
  const adMap = new Map(adsFromDb.map((a) => [a.metaAdId, a.id]));

  const parsed = data
    .map((insight) => {
      const internalAdId = adMap.get(insight.adId);
      if (!internalAdId) {
        console.warn(`⚠️ Ad ${insight.adId} não encontrado, pulando insight.`);
        return null;
      }

      return {
        adId: internalAdId,
        ...insight,
      };
    })
    .filter(Boolean);

  if (!parsed.length) {
    console.log("❌ Nenhum insight de ad válido para inserir.");
    return;
  }

  try {
    await batchInsert(adInsights, parsed);
    console.log("✅ Inserção de insights de anúncios concluída.");
  } catch (err) {
    console.error("💥 Erro na inserção de insights de anúncios:", err);
  }
}
