import express from "express";
import multer from "multer";
import {
  generate,
  improve,
  suggestions,
  getCredits,
  transcribeAudio,
} from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Configurar multer para manejar archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max (límite de OpenAI Whisper)
  },
  fileFilter: (req, file, cb) => {
    // Aceptar solo archivos de audio
    const allowedMimes = [
      "audio/webm",
      "audio/wav",
      "audio/mp3",
      "audio/mpeg",
      "audio/mp4",
      "audio/ogg",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only audio files are allowed."));
    }
  },
});

// Todas las rutas de AI requieren autenticación
router.use(protect);

router.post("/generate", generate);
router.post("/improve", improve);
router.post("/suggestions", suggestions);
router.get("/credits", getCredits);
router.post("/transcribe", upload.single("audio"), transcribeAudio);

export default router;
