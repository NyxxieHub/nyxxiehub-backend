import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const clientes = pgTable("clientes", {
  id: serial("id").primaryKey(),
  nome: text("nome"),
});
