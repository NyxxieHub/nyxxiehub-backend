import express from "express";
import { facebookCallback } from "../controllers/auth/facebook-callback";
import { login } from "../controllers/auth/login";
import { requireAuth } from "@/middleware/require-auth";

const router = express.Router();

router.post("/auth/login", login);
router.get("/auth/facebook/callback", requireAuth, facebookCallback);

export default router;
