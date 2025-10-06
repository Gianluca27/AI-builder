import express from "express";
import {
  generate,
  improve,
  suggestions,
  getCredits,
} from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Todas las rutas de AI requieren autenticación
router.use(protect);

router.post("/generate", generate);
router.post("/improve", improve);
router.post("/suggestions", suggestions);
router.get("/credits", getCredits);

export default router;
