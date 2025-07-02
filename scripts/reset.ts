import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/schemas";
import "dotenv/config";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client, { schema });

async function reset() {
  console.log("🧹 Limpando tabelas...");

  // Delete na ordem certa pra evitar erro de FK
  await db.delete(schema.loginTokens);
  await db.delete(schema.clientSettings);
  await db.delete(schema.managerSettings);
  await db.delete(schema.clients);
  await db.delete(schema.managers);

  console.log("✅ Banco resetado com sucesso!");
  process.exit(0);
}

reset().catch((err) => {
  console.error("❌ Erro ao resetar banco:", err);
  process.exit(1);
});
