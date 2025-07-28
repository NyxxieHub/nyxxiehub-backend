import { syncMetaData } from "@/lib/meta-sync/sync-meta-data";

async function main() {
  console.log("🚀 Iniciando sincronização de dados do Meta...");
  try {
    await syncMetaData();
    console.log("✅ Sincronização concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao sincronizar dados do Meta:", error);
    process.exit(1); // indica que deu erro
  }
}

main();
