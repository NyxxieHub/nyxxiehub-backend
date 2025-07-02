import { Request, Response } from "express";
import { signJwt } from "../../lib/jwt";

export async function login(req: Request, res: Response) {
  const { email } = req.body;

  // aqui tu poderia buscar no banco um manager com esse email
  const fakeManagerId = "c0d3d1-f4k3-uuid"; // depois tu busca real

  const token = signJwt({ managerId: fakeManagerId });
  return res.json({ token });
}
