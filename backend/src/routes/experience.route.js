import express from "express";
import {
  createExperience, deleteExperience, getExperienceById,
  getExperiences, getMyExperiences, updateExperience
} from "../controllers/experience.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getExperiences);

router.get("/myexperiences", protectRoute, getMyExperiences);

router.post("/", protectRoute, createExperience);

router.put("/:id", protectRoute, updateExperience);
router.delete("/:id", protectRoute, deleteExperience);

router.get("/:id", getExperienceById);

export default router;