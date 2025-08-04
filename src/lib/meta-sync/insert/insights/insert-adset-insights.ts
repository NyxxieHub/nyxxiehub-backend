import { db } from "@/index";
import { adSetInsights, adSets } from "@/schemas";
import { batchInsert } from "@/lib/meta-sync/utils/batch-insert";

export async function insertAdSetInsights(data: any[]) {
  if (!data.length) return;

  const adSetsFromDb = await db.query.adSets.findMany();
  const adSetMap = new Map(adSetsFromDb.map((a) => [a.metaAdSetId, a.id]));

  const parsed = data
    .map((insight) => {
      const internalAdSetId = adSetMap.get(insight.adSetId);
      if (!internalAdSetId) {
        console.warn(
          `⚠️ Ad set ${insight.adSetId} não encontrado, pulando insight.`
        );
        return null;
      }

      return {
        adSetId: internalAdSetId,
        ...insight,
      };
    })
    .filter(Boolean);

  if (!parsed.length) {
    console.log("❌ Nenhum insight de ad set válido para inserir.");
    return;
  }

  try {
    await batchInsert(adSetInsights, parsed);
    console.log("✅ Inserção de insights de ad sets concluída.");
  } catch (err) {
    console.error("💥 Erro na inserção de insights de ad sets:", err);
  }
}
