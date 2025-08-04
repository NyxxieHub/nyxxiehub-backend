import { getAllClientsWithTokens } from "./fetch/get-all-clients-with-tokens";
import { syncClientData } from "./sync-client-data";
import { syncClientInsights } from "./sync-client-insights";

export async function syncMetaData() {
  const clients = await getAllClientsWithTokens();

  for (const client of clients) {
    try {
      console.log(
        `🔄 Sincronizando estrutura do cliente ${client.clientId}...`
      );
      await syncClientData(client.clientId);

      console.log(`📊 Sincronizando insights do cliente ${client.clientId}...`);
      await syncClientInsights(client.clientId);

      console.log(`✅ Cliente ${client.clientId} sincronizado com sucesso.`);
    } catch (err) {
      console.error("❌ Erro ao sincronizar dados do cliente", err);
    }
  }
}
