import { getAllClientsWithTokens } from "./fetch/get-all-clients-with-tokens";
import { syncClientData } from "./sync-client-data";

export async function syncMetaData() {
  const clients = await getAllClientsWithTokens();

  for (const client of clients) {
    try {
      await syncClientData(client.clientId);
    } catch (err) {
      console.error(
        "Erro ao sincronizar dados do client:",
        client.clientId,
        err
      );
    }
  }
}
