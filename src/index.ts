/// <reference path="./types/express.d.ts" />
import express from "express";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import session from "express-session";
import authRoutes from "./routes/auth";
import cors from "cors";
config();

const app = express();
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

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(authRoutes);

app.get("/", (req, res) => {
  res.send("Servidor rodando! 🚀");
});

app.listen(3000, () => {
  console.log("Server on http://localhost:3000");
});

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client);
