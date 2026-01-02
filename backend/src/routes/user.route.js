import express from "express";
import { getUserAIHistory, getUserProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", protectRoute, getUserProfile);

router.get("/history", protectRoute, getUserAIHistory);

export default router;