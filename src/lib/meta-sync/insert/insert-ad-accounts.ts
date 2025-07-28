import { db } from "@/index";
import { adAccounts } from "@/schemas";
import { batchInsert } from "../utils/batch-insert";
import { AdAccountInput } from "../types/ad-accounts";

type AdAccountInsert = typeof adAccounts.$inferInsert;

export async function insertAdAccounts(accounts: AdAccountInput[]) {
  const insertData: AdAccountInsert[] = accounts.map((account) => ({
    metaAccountId: account.meta_ad_account_id,
    name: account.name,
    status: account.status,
    currency: account.currency,
    timezone: account.timezone,
    clientId: account.client_id,
  }));

  await batchInsert(adAccounts, insertData);
}
