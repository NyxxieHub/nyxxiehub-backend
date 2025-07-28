import { fetchAdAccounts } from "../src/lib/meta-sync/fetch/fetch-ad-accounts";
import { insertAdAccounts } from "../src/lib/meta-sync/insert/insert-ad-accounts";

const TEST_CLIENT_ID = "41011e52-595d-4f0f-b30d-f12a444501a6";

async function testAdAccountSync() {
  try {
    const adAccounts = await fetchAdAccounts(TEST_CLIENT_ID);
    console.log(`🎯 ${adAccounts.length} ad accounts encontradas`);

    await insertAdAccounts(adAccounts);
    console.log("✅ Ad accounts inseridas com sucesso!");
  } catch (err) {
    console.error("💥 Erro ao sincronizar ad accounts:", err);
  }
}

testAdAccountSync();
