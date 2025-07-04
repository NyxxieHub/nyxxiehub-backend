import { db } from "@/index";
import { facebookTokens } from "@/schemas/meta-api/facebook-tokens"; // ajusta o caminho
import { eq } from "drizzle-orm";

export async function saveFacebookToken({
  clientId,
  token,
  accessToken,
  fbUserId,
  expiresAt,
}: {
  clientId: string;
  token: string;
  accessToken: string;
  fbUserId: string;
  expiresAt: Date;
}) {
  // opcional: deletar tokens antigos do mesmo client antes de inserir um novo
  await db.delete(facebookTokens).where(eq(facebookTokens.client_id, clientId));

  console.log("🔥 Salvando token com:", {
    clientId,
    token,
    accessToken,
    fbUserId,
    expiresAt,
  });

  await db.insert(facebookTokens).values({
    token,
    access_token: accessToken,
    fb_user_id: fbUserId,
    client_id: clientId,
    expires_at: expiresAt,
  });
}
