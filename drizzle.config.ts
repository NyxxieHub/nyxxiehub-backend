import { defineConfig } from "drizzle-kit";
import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  schema: [
    "./src/schemas/client/*.ts",
    "./src/schemas/manager/*.ts",
    "./src/schemas/meta-api/**/*.ts",
  ],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} as Config);
