import express from "express";
import { 
  createPreparation, 
  getMyPreparations, 
  deletePreparation 
} from "../controllers/preparation.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createPreparation);
router.get("/", protectRoute, getMyPreparations);
router.delete("/:id", protectRoute, deletePreparation);

export default router;