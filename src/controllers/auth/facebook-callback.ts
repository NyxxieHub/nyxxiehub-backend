import { Request, Response } from "express";
import axios from "axios";
import { saveFacebookToken } from "@/services/client/save-facebook-token";
import { db } from "@/index";
import { client } from "@/schemas/client/client";
import { eq } from "drizzle-orm";

const APP_ID = process.env.FB_APP_ID;
const APP_SECRET = process.env.FB_APP_SECRET;
const REDIRECT_URI = process.env.FB_REDIRECT_URI;

export async function facebookCallback(req: Request, res: Response) {
  const { code, clientId, accessToken } = req.body;

  if (!code || !clientId || !accessToken) {
    return res
      .status(400)
      .json({ error: "code, clientId ou accessToken faltando" });
  }

  const managerId = req.managerId;

  if (!managerId) {
    return res.status(401).json({ error: "Manager não autenticado" });
  }

  try {
    // 🔐 Verifica se client pertence ao manager
    const clientData = await db.query.client.findFirst({
      where: eq(client.id, clientId),
    });

    if (!clientData || clientData.managerId !== managerId) {
      return res.status(403).json({ error: "Esse client não pertence a você" });
    }

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

    // 2. Troca pelo token de longo prazo
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

    // 3. Pega o ID do usuário do Facebook
    const meRes = await axios.get("https://graph.facebook.com/v19.0/me", {
      params: {
        access_token: longLivedToken,
      },
    });

    const fbUserId = meRes.data.id;

    // 4. Salva no banco
    await saveFacebookToken({
      clientId,
      token: shortLivedToken,
      accessToken: longLivedToken,
      fbUserId,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
    });

    return res.status(200).json({ message: "Token salvo com sucesso" });
  } catch (error: any) {
    if (error.response) {
      console.error("Erro ao trocar o token:", error.response.data);
    } else if (error.request) {
      console.error("Erro na requisição ao Facebook:", error.request);
    } else {
      console.error("Erro inesperado:", error.message);
    }

    return res
      .status(500)
      .json({ error: "Erro ao trocar token com o Facebook" });
  }
}
