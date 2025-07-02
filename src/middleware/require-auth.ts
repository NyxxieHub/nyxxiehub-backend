import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../lib/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyJwt(token);

  if (!decoded || typeof decoded !== "object") {
    return res.status(401).json({ error: "Token inválido" });
  }

  if (decoded.managerId) {
    req.managerId = decoded.managerId;
  }

  if (decoded.clientId) {
    req.clientId = decoded.clientId;
  }

  if (!req.managerId && !req.clientId) {
    return res.status(401).json({ error: "Usuário não autorizado" });
  }

  next();
}
