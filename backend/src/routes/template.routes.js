import express from "express";
import Template from "../models/Template.model.js";

const router = express.Router();

/**
 * @route   GET /api/templates
 * @desc    Obtener todos los templates
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const { category, isPremium, limit = 20 } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;
    if (isPremium) query.isPremium = isPremium === "true";

    const templates = await Template.find(query)
      .select("-htmlCode -cssCode -jsCode") // No enviar código en lista
      .limit(parseInt(limit))
      .sort("-usageCount");

    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching templates",
    });
  }
});

/**
 * @route   GET /api/templates/:id
 * @desc    Obtener template por ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    // Incrementar contador de uso
    await template.incrementUsage();

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching template",
    });
  }
});

export default router;
