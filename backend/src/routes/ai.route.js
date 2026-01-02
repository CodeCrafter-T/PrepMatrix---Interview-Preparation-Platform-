import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { generateReview, getAIReview } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/generate", protectRoute, generateReview);

router.get("/:id", protectRoute, getAIReview);

export default router;