import { db } from "@/index";
import { adAccounts } from "@/schemas";
import { eq } from "drizzle-orm";

interface AdAccountInput {
  meta_ad_account_id: string;
  name: string;
  status: string;
  currency: string;
  timezone: string;
  client_id: string;
}

export async function insertAdAccounts(accounts: AdAccountInput[]) {
  for (const account of accounts) {
    const existing = await db
      .select()
      .from(adAccounts)
      .where(eq(adAccounts.metaAccountId, account.meta_ad_account_id));

    if (existing.length > 0) continue;

    await db.insert(adAccounts).values({
      metaAccountId: account.meta_ad_account_id,
      name: account.name,
      status: account.status,
      currency: account.currency,
      timezone: account.timezone,
      clientId: account.client_id,
    });
  }
}
