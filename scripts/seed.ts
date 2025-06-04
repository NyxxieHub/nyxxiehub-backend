import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/schemas";
import "dotenv/config";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client, { schema });

async function main() {
  const [manager] = await db
    .insert(schema.managers)
    .values({
      name: "Rita Manager",
      email: "rita@example.com",
    })
    .returning();

  const [client] = await db
    .insert(schema.clients)
    .values({
      name: "Cliente Exemplo",
      email: "cliente@exemplo.com",
      managerId: manager.id,
    })
    .returning();

  await db.insert(schema.settings).values({
    clientId: client.id,
    preferences: {
      reportChannel: "whatsapp",
      time: "18:00",
    },
  });

  console.log("Seed feito com sucesso!");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
