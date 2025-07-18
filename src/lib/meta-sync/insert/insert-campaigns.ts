import { db } from "@/index";
import { campaigns } from "@/schemas";
import { eq } from "drizzle-orm";
import { safeDate } from "@/utils/safe-date";

type CampaignInsert = typeof campaigns.$inferInsert;

interface CampaignInput {
  meta_campaign_id: string;
  name: string;
  ad_account_id: string;
  status: string;
  objective: string;
  effective_status: string;
  created_time: string;
  updated_time?: string;
  start_time?: string;
  stop_time?: string;
}

export async function insertCampaigns(campaignList: CampaignInput[]) {
  for (const campaign of campaignList) {
    const createdTime = safeDate(campaign.created_time);
    if (!createdTime) {
      console.warn(
        `⚠️ Invalid created_time for campaign ${campaign.meta_campaign_id}, skipping...`
      );
      continue;
    }

    const baseData: CampaignInsert = {
      metaCampaignId: campaign.meta_campaign_id,
      name: campaign.name,
      adAccountId: campaign.ad_account_id,
      status: campaign.status,
      objective: campaign.objective,
      effectiveStatus: campaign.effective_status,
      createdTime,
      updatedTime: campaign.updated_time
        ? safeDate(campaign.updated_time) ?? undefined
        : undefined,
      startTime: campaign.start_time
        ? safeDate(campaign.start_time) ?? undefined
        : undefined,
      stopTime: campaign.stop_time
        ? safeDate(campaign.stop_time) ?? undefined
        : undefined,
    };

    const existing = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.metaCampaignId, campaign.meta_campaign_id));

    if (existing.length > 0) {
      await db
        .update(campaigns)
        .set(baseData)
        .where(eq(campaigns.metaCampaignId, campaign.meta_campaign_id));
    } else {
      await db.insert(campaigns).values(baseData);
    }
  }
}
