import Project from "../models/Project.model.js";

/**
 * @route   GET /api/projects
 * @desc    Obtener todos los proyectos del usuario
 * @access  Private
 */
export const getProjects = async (req, res) => {
  try {
    const {
      status,
      type,
      sort = "-createdAt",
      limit = 20,
      page = 1,
    } = req.query;

    const query = { user: req.user.id };

    if (status) query.status = status;
    if (type) query.type = type;

    const skip = (page - 1) * limit;

    const projects = await Project.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .select("-htmlCode -cssCode -jsCode"); // No enviar código completo en lista

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: projects,
    });
  } catch (error) {
    console.error("Get Projects Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
    });
  }
};

/**
 * @route   GET /api/projects/:id
 * @desc    Obtener proyecto por ID
 * @access  Private
 */
export const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Get Project Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching project",
    });
  }
};

/**
 * @route   POST /api/projects
 * @desc    Crear nuevo proyecto
 * @access  Private
 */
export const createProject = async (req, res) => {
  try {
    const { name, prompt, htmlCode, cssCode, jsCode, type, description } =
      req.body;

    if (!name || !htmlCode) {
      return res.status(400).json({
        success: false,
        message: "Name and HTML code are required",
      });
    }

    const project = await Project.create({
      user: req.user.id,
      name,
      prompt,
      htmlCode,
      cssCode: cssCode || "",
      jsCode: jsCode || "",
      type: type || "custom",
      description,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating project",
    });
  }
};

/**
 * @route   PUT /api/projects/:id
 * @desc    Actualizar proyecto
 * @access  Private
 */
export const updateProject = async (req, res) => {
  try {
    let project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const allowedUpdates = [
      "name",
      "description",
      "htmlCode",
      "cssCode",
      "jsCode",
      "status",
      "customizations",
    ];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    project = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    await project.updateLastEdited();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Update Project Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating project",
    });
  }
};

/**
 * @route   DELETE /api/projects/:id
 * @desc    Eliminar proyecto
 * @access  Private
 */
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete Project Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting project",
    });
  }
};

/**
 * @route   POST /api/projects/:id/duplicate
 * @desc    Duplicar proyecto
 * @access  Private
 */
export const duplicateProject = async (req, res) => {
  try {
    const original = await Project.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!original) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const duplicate = await Project.create({
      user: req.user.id,
      name: `${original.name} (Copy)`,
      description: original.description,
      prompt: original.prompt,
      htmlCode: original.htmlCode,
      cssCode: original.cssCode,
      jsCode: original.jsCode,
      type: original.type,
      customizations: original.customizations,
    });

    res.status(201).json({
      success: true,
      message: "Project duplicated successfully",
      data: duplicate,
    });
  } catch (error) {
    console.error("Duplicate Project Error:", error);
    res.status(500).json({
      success: false,
      message: "Error duplicating project",
    });
  }
};

/**
 * @route   GET /api/projects/public/explore
 * @desc    Obtener proyectos públicos
 * @access  Public
 */
export const getPublicProjects = async (req, res) => {
  try {
    const { type, sort = "-views", limit = 12 } = req.query;

    const query = { isPublic: true, status: "published" };
    if (type) query.type = type;

    const projects = await Project.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .populate("user", "name avatar")
      .select("-htmlCode -cssCode -jsCode");

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching public projects",
    });
  }
};

export default {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  duplicateProject,
  getPublicProjects,
};
