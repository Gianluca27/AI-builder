import express from "express";
import {
  initiateGithubAuth,
  handleGithubCallback,
  createRepository,
  updateRepository,
  listRepositories,
  readRepository,
  disconnectGithub
} from "../controllers/github.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// GitHub OAuth routes
router.get("/auth", protect, initiateGithubAuth);
router.get("/callback", handleGithubCallback);

// Repository management routes
router.post("/repos", protect, listRepositories);
router.post("/read-repo", protect, readRepository);
router.post("/create-repo", protect, createRepository);
router.post("/update-repo", protect, updateRepository);
router.post("/disconnect", protect, disconnectGithub);

export default router;
