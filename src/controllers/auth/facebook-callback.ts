import { Request, Response } from "express";
import axios from "axios";
import { saveFacebookToken } from "@/services/client/save-facebook-token";

const APP_ID = process.env.FB_APP_ID;
const APP_SECRET = process.env.FB_APP_SECRET;
const REDIRECT_URI = "http://localhost:3000/auth/facebook/callback";

export async function facebookCallback(req: Request, res: Response) {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).json({ error: "Código não informado" });
  }

  try {
    // 1. Troca o código pelo token de acesso curto
    const shortTokenRes = await axios.get(
      "https://graph.facebook.com/v19.0/oauth/access_token",
      {
        params: {
          client_id: APP_ID,
          redirect_uri: REDIRECT_URI,
          client_secret: APP_SECRET,
          code,
        },
      }
    );

    const shortLivedToken = shortTokenRes.data.access_token;

    // 2. Troca o token curto por um token de longo prazo
    const longTokenRes = await axios.get(
      "https://graph.facebook.com/v19.0/oauth/access_token",
      {
        params: {
          grant_type: "fb_exchange_token",
          client_id: APP_ID,
          client_secret: APP_SECRET,
          fb_exchange_token: shortLivedToken,
        },
      }
    );

    const longLivedToken = longTokenRes.data.access_token;
    const expiresIn = longTokenRes.data.expires_in;

    // 3. Pega o fb_user_id usando o token
    const meRes = await axios.get("https://graph.facebook.com/v19.0/me", {
      params: {
        access_token: longLivedToken,
      },
    });

    const fbUserId = meRes.data.id;

    // 4. Salva no banco atrelado ao client
    const clientId = req.clientId;

    if (!clientId) {
      return res.status(401).json({ error: "Client não autenticado" });
    }

    await saveFacebookToken({
      clientId,
      token: shortLivedToken,
      accessToken: longLivedToken,
      fbUserId,
      expiresAt: new Date(Date.now() + expiresIn * 1000), // expiresIn em segundos
    });

    return res.status(200).json({ token: longLivedToken });
  } catch (error) {
    console.error("Erro ao trocar o token:", error);
    return res
      .status(500)
      .json({ error: "Erro ao trocar token com o Facebook" });
  }
}
