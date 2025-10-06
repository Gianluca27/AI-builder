import express from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  duplicateProject,
  getPublicProjects,
} from "../controllers/project.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rutas públicas
router.get("/public/explore", getPublicProjects);

// Rutas protegidas
router.use(protect); // Todas las rutas siguientes requieren autenticación

router.route("/").get(getProjects).post(createProject);

router.route("/:id").get(getProject).put(updateProject).delete(deleteProject);

router.post("/:id/duplicate", duplicateProject);

export default router;
