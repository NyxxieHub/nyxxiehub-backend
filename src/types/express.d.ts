import "express";

declare module "express" {
  export interface Request {
    managerId?: string;
    clientId?: string;
  }
}
