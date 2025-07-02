import express from "express";
import axios from "axios";
import { signJwt } from "@/lib/jwt";
import { db } from "@/index"; // ajusta conforme teu projeto
import { facebookTokens } from "@/schemas/meta-api/facebook-tokens"; // ajusta path

const router = express.Router();

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID!;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET!;
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI!;

router.get("/callback", async (req, res) => {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Missing code" });
  }

  try {
    // 1. Troca code por access_token
    const tokenResponse = await axios.get(
      "https://graph.facebook.com/v19.0/oauth/access_token",
      {
        params: {
          client_id: FACEBOOK_APP_ID,
          client_secret: FACEBOOK_APP_SECRET,
          redirect_uri: REDIRECT_URI,
          code,
        },
      }
    );

    const shortToken = tokenResponse.data.access_token;

    // 2. Troca por token de LONGO PRAZO
    const longTokenRes = await axios.get(
      "https://graph.facebook.com/v19.0/oauth/access_token",
      {
        params: {
          grant_type: "fb_exchange_token",
          client_id: FACEBOOK_APP_ID,
          client_secret: FACEBOOK_APP_SECRET,
          fb_exchange_token: shortToken,
        },
      }
    );

    const longToken = longTokenRes.data.access_token;

    // 3. Opcional: pegar info do usuário
    const userRes = await axios.get("https://graph.facebook.com/me", {
      params: {
        access_token: longToken,
        fields: "id,name,email",
      },
    });

    const user = userRes.data;

    // 4. Salva o token no banco
    await db.insert(facebookTokens).values({
      manager_id: "TEMP_ID", // depois substitui
      fb_user_id: user.id,
      access_token: longToken,
      token: longToken, // 👈 necessário
      expires_at: new Date(Date.now() + 60 * 60 * 24 * 1000), // 👈 por exemplo, 24h
      created_at: new Date(),
    });

    // 5. Gera JWT de sessão
    const jwt = signJwt({ manager_id: "TEMP_ID", fb_user_id: user.id });

    return res.json({ token: jwt });
  } catch (err) {
    console.error("Facebook login error", err);
    return res
      .status(500)
      .json({ error: "Erro ao fazer login com o Facebook" });
  }
});

export default router;
