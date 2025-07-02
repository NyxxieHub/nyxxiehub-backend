import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/schemas";
import "dotenv/config";
import { randomUUID } from "crypto";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client, { schema });

async function main() {
  const [manager] = await db
    .insert(schema.managers)
    .values({
      id: randomUUID(),
      name: "Rita Manager",
      email: "rita@example.com",
      userId: "00000000-0000-0000-0000-000000000000",
    })
    .returning();

  await db.insert(schema.managerSettings).values({
    id: randomUUID(),
    managerId: manager.id,
    companyName: "Pink Agency",
    logoUrl: "https://placehold.co/150x50?text=Logo",
    clientsBranding: {
      primaryColor: "#FF3366",
      customMessage: "Seja bem-vindo(a) ao seu painel 💖",
      buttonStyle: "rounded",
      dashboardStyle: "minimal",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [clientEntry] = await db
    .insert(schema.clients)
    .values({
      id: randomUUID(),
      name: "Example Client",
      email: "client@example.com",
      photoUrl: "https://placehold.co/100x100",
      password: "123456",
      accessToken: randomUUID(),
      passwordEnabled: true,
      customization: {
        primaryColor: "#FF3366",
        companyName: "Pink Agency",
        customMessage: "Welcome to your dashboard 💖",
        logoUrl: "https://placehold.co/150x50?text=Pink+Agency",
      },
      managerId: manager.id,
    })
    .returning();

  await db.insert(schema.clientSettings).values({
    id: randomUUID(),
    clientId: clientEntry.id,
    preferences: {
      reportChannel: "whatsapp",
      time: "18:00",
    },
  });

  await db.insert(schema.loginTokens).values({
    id: randomUUID(),
    token: randomUUID(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    managerId: manager.id,
    createdAt: new Date(),
  });

  console.log("🧸 Seedzão executado com sucesso!");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
