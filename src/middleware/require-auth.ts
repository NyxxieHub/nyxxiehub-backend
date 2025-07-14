import { Request, Response, NextFunction } from "express";

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
    const userRes = await fetch(
      "https://zfymkivofkcdiapgutix.supabase.co/auth/v1/user",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: process.env.SUPABASE_ANON_KEY!,
        },
      }
    );

    const user = await userRes.json();

    if (!user || userRes.status !== 200 || !user.id) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    // Aqui tu pode fazer lógica extra se quiser, tipo buscar no banco o client com o mesmo email ou id
    req.managerId = user.id;
    next();
  } catch (error) {
    console.error("Erro ao validar token Supabase:", error);
    return res.status(500).json({ error: "Erro interno de autenticação" });
  }
}
