import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/schemas";
import { randomUUID } from "crypto";
import "dotenv/config";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client, { schema });

async function main() {
  const [manager] = await db
    .insert(schema.manager)
    .values({
      name: "Rita Manager",
      email: "rita@example.com",
      supabaseUserAuth: "00000000-0000-0000-0000-000000000000",
      createdAt: new Date(),
      companyName: "Pink Agency",
      managerImg: "https://placehold.co/150x150?text=Rita",
    })
    .returning();

  const [clientEntry] = await db
    .insert(schema.client)
    .values({
      name: "Example Client",
      email: "client@example.com",
      password: "123456",
      number: "11999999999",
      clientImg: "https://placehold.co/100x100",
      createdAt: new Date(),
      managerId: manager.id,
      companyName: "Pink Agency",
    })
    .returning();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
