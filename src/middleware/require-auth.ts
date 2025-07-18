import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "@/index";
import { manager } from "@/schemas/manager/manager";
import { eq } from "drizzle-orm";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as { sub?: string };

    if (!decoded?.sub) {
      return res.status(401).json({ error: "Token inválido" });
    }

    // 🔍 Busca o manager pelo supabaseUserAuth
    const managerData = await db.query.manager.findFirst({
      where: eq(manager.supabaseUserAuth, decoded.sub),
    });

    if (!managerData) {
      return res.status(401).json({ error: "Manager não encontrado" });
    }

    // ✅ Agora sim! Salva o ID real
    req.managerId = managerData.id;

    next();
  } catch (error) {
    console.error("Erro ao autenticar:", error);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
