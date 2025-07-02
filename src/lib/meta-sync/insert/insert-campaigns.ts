import { db } from "@/index";
import { campaigns } from "@/schemas";
import { eq } from "drizzle-orm";

interface CampaignInput {
  id: string;
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
    const existing = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, campaign.id));

    if (existing.length > 0) {
      await db
        .update(campaigns)
        .set({
          metaCampaignId: campaign.meta_campaign_id,
          name: campaign.name,
          adAccountId: campaign.ad_account_id,
          status: campaign.status,
          objective: campaign.objective,
          effectiveStatus: campaign.effective_status,
          createdTime: new Date(campaign.created_time),
          updatedTime: campaign.updated_time
            ? new Date(campaign.updated_time)
            : null,
          startTime: campaign.start_time ? new Date(campaign.start_time) : null,
          stopTime: campaign.stop_time ? new Date(campaign.stop_time) : null,
        })
        .where(eq(campaigns.id, campaign.id));
    } else {
      await db.insert(campaigns).values({
        id: campaign.id,
        metaCampaignId: campaign.meta_campaign_id,
        name: campaign.name,
        adAccountId: campaign.ad_account_id,
        status: campaign.status,
        objective: campaign.objective,
        effectiveStatus: campaign.effective_status,
        createdTime: new Date(campaign.created_time),
        updatedTime: campaign.updated_time
          ? new Date(campaign.updated_time)
          : null,
        startTime: campaign.start_time ? new Date(campaign.start_time) : null,
        stopTime: campaign.stop_time ? new Date(campaign.stop_time) : null,
      });
    }
  }
}
