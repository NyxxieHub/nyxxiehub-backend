export type MetaAdAccount = {
  account_id: string;
  name: string;
  account_status: number;
  currency: string;
  time_zone_name?: string;
};

export type AdAccountInput = {
  meta_ad_account_id: string;
  name: string;
  status: string;
  currency: string;
  timezone: string;
  client_id: string;
};
