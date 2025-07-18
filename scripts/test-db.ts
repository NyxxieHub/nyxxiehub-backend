import { db } from "../src/index";
import { facebookTokens } from "../src/schemas/meta-api/facebook-tokens";

async function testDb() {
  try {
    const tokens = await db.select().from(facebookTokens);
    console.log("📦 TOKENS ENCONTRADOS:", tokens);
  } catch (err) {
    console.error("❌ ERRO DE CONEXÃO:", err);
  }
}

testDb();
