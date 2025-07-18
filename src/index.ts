/// <reference path="./types/express.d.ts" />
import express from "express";
import session from "express-session";
import cors from "cors";
import authRoutes from "./routes/auth";

import { config } from "dotenv";
config(); // precisa vir antes de usar o DATABASE_URL

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@/schemas";
export const db = drizzle(
  postgres(process.env.DATABASE_URL!, { ssl: "require" }),
  { schema }
);

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

const app = express();

// Middlewares
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "my-default-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  cors({
    origin: "https://114833c0-7305-4c4e-b28e-0b0cfd3f5b52.weweb-preview.io",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rotas
app.use(authRoutes);
app.get("/", (_, res) => res.send("Servidor rodando! 🚀"));

// Só inicia o servidor se rodar diretamente (não em script externo tipo sync)
if (process.argv[1] === __filename) {
  app.listen(3000, () => {
    console.log("Server on http://localhost:3000");
  });
}
