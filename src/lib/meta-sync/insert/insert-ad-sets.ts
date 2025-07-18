import { db } from "@/index";
import { adSets } from "@/schemas";
import { eq } from "drizzle-orm";
import { safeDate } from "@/utils/safe-date";

type AdSetInsert = typeof adSets.$inferInsert;

interface AdSetInput {
  id: string;
  meta_ad_set_id: string;
  campaign_id: string;
  name: string;
  status: string;
  effective_status: string;
  daily_budget?: number;
  start_time: string;
  end_time?: string;
}

export async function insertAdSets(adSetList: AdSetInput[]) {
  for (const adSet of adSetList) {
    const existing = await db
      .select()
      .from(adSets)
      .where(eq(adSets.id, adSet.id));

    const startTime = safeDate(adSet.start_time);
    if (!startTime) {
      console.warn(`⚠️ Invalid start_time for adSet ${adSet.id}, skipping...`);
      continue;
    }

    const baseData: AdSetInsert = {
      metaAdSetId: adSet.meta_ad_set_id,
      campaignId: adSet.campaign_id,
      name: adSet.name,
      status: adSet.status,
      effectiveStatus: adSet.effective_status,
      dailyBudget: adSet.daily_budget ?? undefined,
      startTime,
      endTime: adSet.end_time
        ? safeDate(adSet.end_time) ?? undefined
        : undefined,
    };

    if (existing.length > 0) {
      await db.update(adSets).set(baseData).where(eq(adSets.id, adSet.id));
    } else {
      await db.insert(adSets).values({ id: adSet.id, ...baseData });
    }
  }
}
