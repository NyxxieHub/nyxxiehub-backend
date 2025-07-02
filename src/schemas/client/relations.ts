import { relations } from "drizzle-orm";
import { client } from "./client";
import { manager } from "../manager/manager";
import { adAccounts } from "../meta-api/ad-accounts";

export const clientsRelations = relations(client, ({ one }) => ({
  //many to one com o manager
  manager: one(manager, {
    fields: [client.managerId],
    references: [manager.id],
  }),
}));

export const clientRelations = relations(client, ({ many }) => ({
  //one to many com as contas de anuncio
  adAccounts: many(adAccounts),
}));
