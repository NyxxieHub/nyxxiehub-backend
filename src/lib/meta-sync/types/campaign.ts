export type MetaCampaign = {
  id: string;
  account_id: string;
  name: string;
  status: string;
  effective_status: string;
  objective: string;
  created_time: string;
  updated_time: string;
  start_time?: string;
  stop_time?: string;
};

export type CampaignInput = {
  meta_campaign_id: string;
  name: string;
  ad_account_id: string;
  status: string;
  effective_status: string;
  objective: string;
  created_time: string;
  updated_time?: string;
  start_time?: string;
  stop_time?: string;
};
