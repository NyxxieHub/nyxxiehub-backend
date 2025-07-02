import { relations } from "drizzle-orm";
import { manager } from "./manager";
import { client } from "../client/client";

export const managersRelations = relations(manager, ({ many }) => ({
  clients: many(client),
}));
