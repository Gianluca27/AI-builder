import Template from "../models/Template.model.js";

/**
 * @route   GET /api/templates
 * @desc    Obtener todos los templates activos
 * @access  Public
 */
export const getTemplates = async (req, res) => {
  try {
    const { category, isPremium, limit = 20, sort = "-usageCount" } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;
    if (isPremium !== undefined) query.isPremium = isPremium === "true";

    const templates = await Template.find(query)
      .select("-htmlCode -cssCode -jsCode") // No enviar código en lista
      .limit(parseInt(limit))
      .sort(sort);

    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    console.error("Get Templates Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching templates",
    });
  }
};

/**
 * @route   GET /api/templates/:id
 * @desc    Obtener template por ID con código completo
 * @access  Public
 */
export const getTemplateById = async (req, res) => {
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
    console.error("Get Template Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching template",
    });
  }
};

/**
 * @route   GET /api/templates/category/:category
 * @desc    Obtener templates por categoría
 * @access  Public
 */
export const getTemplatesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const templates = await Template.find({
      category,
      isActive: true,
    })
      .select("-htmlCode -cssCode -jsCode")
      .limit(parseInt(limit))
      .sort("-usageCount");

    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    console.error("Get Templates by Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching templates",
    });
  }
};

/**
 * @route   GET /api/templates/featured
 * @desc    Obtener templates destacados
 * @access  Public
 */
export const getFeaturedTemplates = async (req, res) => {
  try {
    const templates = await Template.find({
      isActive: true,
    })
      .select("-htmlCode -cssCode -jsCode")
      .sort("-usageCount -rating.average")
      .limit(6);

    res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error("Get Featured Templates Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching featured templates",
    });
  }
};

export default {
  getTemplates,
  getTemplateById,
  getTemplatesByCategory,
  getFeaturedTemplates,
};
