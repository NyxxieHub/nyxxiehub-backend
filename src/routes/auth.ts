import express from "express";
import { facebookCallback } from "../controllers/auth/facebook-callback";
import { login } from "../controllers/auth/login";

const router = express.Router();

router.post("/auth/login", login);
router.get("/auth/facebook/callback", facebookCallback);

export default router;
