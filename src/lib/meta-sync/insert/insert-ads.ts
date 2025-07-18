import { db } from "@/index";
import { ads } from "@/schemas";
import { eq } from "drizzle-orm";
import { safeDate } from "@/utils/safe-date";

type AdInsert = typeof ads.$inferInsert;

interface AdInput {
  id: string;
  meta_ad_id: string;
  ad_set_id: string;
  name: string;
  status: string;
  effective_status: string;
  created_time: string;
  updated_time?: string;
  ad_review_feedback?: any;
  creative?: any;
}

export async function insertAds(adList: AdInput[]) {
  for (const ad of adList) {
    const existing = await db.select().from(ads).where(eq(ads.id, ad.id));

    const createdTime = safeDate(ad.created_time);
    if (!createdTime) {
      console.warn(`⚠️ Invalid created_time for ad ${ad.id}, skipping...`);
      continue;
    }

    const baseData: AdInsert = {
      metaAdId: ad.meta_ad_id,
      adSetId: ad.ad_set_id,
      name: ad.name,
      status: ad.status,
      effectiveStatus: ad.effective_status,
      createdTime,
      updatedTime: ad.updated_time
        ? safeDate(ad.updated_time) ?? undefined
        : undefined,
      adReviewFeedback: ad.ad_review_feedback || undefined,
      creative: ad.creative || undefined,
    };

    if (existing.length > 0) {
      await db.update(ads).set(baseData).where(eq(ads.id, ad.id));
    } else {
      await db.insert(ads).values({ id: ad.id, ...baseData });
    }
  }
}
