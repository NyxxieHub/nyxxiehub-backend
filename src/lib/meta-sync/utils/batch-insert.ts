import { db } from "@/index";
import { AnyPgTable } from "drizzle-orm/pg-core";

export async function batchInsert<T>(
  table: AnyPgTable,
  data: T[],
  chunkSize = 500
) {
  const DRIZZLE_TABLE_NAME = Symbol.for("drizzle:Name");

  if (!data.length) return;

  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);

    try {
      await db.insert(table).values(chunk);
    } catch (error) {
      console.error(
        `[batchInsert] Erro ao inserir chunk de ${
          (table as any)[DRIZZLE_TABLE_NAME] ?? "tabela desconhecida"
        }:`,
        error
      );
      throw error;
    }
  }
}
