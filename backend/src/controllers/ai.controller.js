import {
  generateWebsiteCode,
  improveCode,
  generateDesignSuggestions,
} from "../services/openai.service.js";
import Project from "../models/Project.model.js";
import User from "../models/User.model.js";

/**
 * @route   POST /api/ai/generate
 * @desc    Genera código de sitio web usando IA
 * @access  Private
 */
export const generate = async (req, res, next) => {
  try {
    const { prompt, type, style, includeJS, saveAs } = req.body;
    const userId = req.user.id;

    // Validar prompt
    if (!prompt || prompt.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Prompt must be at least 10 characters long",
      });
    }

    // Verificar si puede generar (créditos o plan)
    const user = await User.findById(userId);

    if (!user.canGenerate()) {
      return res.status(403).json({
        success: false,
        message:
          "No credits remaining. Please upgrade your plan or buy more credits.",
        credits: user.credits,
        plan: user.plan,
      });
    }

    // Generar código con OpenAI
    const result = await generateWebsiteCode(prompt, {
      type,
      style: style || "modern",
      includeJS: includeJS || false,
      responsive: true,
    });

    // Consumir crédito (para todos los planes menos enterprise)
    if (user.plan !== "enterprise") {
      await user.useCredit();
    }

    // Guardar proyecto si se especificó nombre
    let project = null;
    if (saveAs) {
      project = await Project.create({
        user: userId,
        name: saveAs,
        prompt,
        htmlCode: result.htmlCode,
        cssCode: result.cssCode,
        jsCode: result.jsCode,
        type: result.type,
        status: "draft",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        htmlCode: result.htmlCode,
        cssCode: result.cssCode,
        jsCode: result.jsCode,
        type: result.type,
        project: project
          ? {
              id: project._id,
              name: project.name,
            }
          : null,
      },
      meta: {
        creditsRemaining: user.credits,
        tokensUsed: result.tokensUsed,
        model: result.model,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error("Generate Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate website",
    });
  }
};

/**
 * @route   POST /api/ai/improve
 * @desc    Mejora código existente
 * @access  Private
 */
export const improve = async (req, res, next) => {
  try {
    const { code, improvements } = req.body;
    const userId = req.user.id;

    if (!code || !improvements) {
      return res.status(400).json({
        success: false,
        message: "Code and improvements are required",
      });
    }

    const user = await User.findById(userId);

    if (!user.canGenerate()) {
      return res.status(403).json({
        success: false,
        message: "No credits remaining",
      });
    }

    const result = await improveCode(code, improvements);

    if (user.plan !== "enterprise") {
      await user.useCredit();
    }

    res.status(200).json({
      success: true,
      data: {
        htmlCode: result.htmlCode,
      },
      meta: {
        creditsRemaining: user.credits,
        tokensUsed: result.tokensUsed,
      },
    });
  } catch (error) {
    console.error("Improve Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to improve code",
    });
  }
};

/**
 * @route   POST /api/ai/suggestions
 * @desc    Obtiene sugerencias de diseño
 * @access  Private
 */
export const suggestions = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const result = await generateDesignSuggestions(prompt);

    res.status(200).json({
      success: true,
      data: result.suggestions,
      meta: {
        tokensUsed: result.tokensUsed,
      },
    });
  } catch (error) {
    console.error("Suggestions Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate suggestions",
    });
  }
};

/**
 * @route   GET /api/ai/credits
 * @desc    Obtiene créditos restantes del usuario
 * @access  Private
 */
export const getCredits = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("credits plan usage");

    res.status(200).json({
      success: true,
      data: {
        credits: user.credits,
        plan: user.plan,
        unlimited: user.plan === "enterprise",
        usage: {
          thisMonth: user.usage.thisMonthGenerations,
          total: user.usage.totalGenerations,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch credits",
    });
  }
};

/**
 * @route   POST /api/ai/transcribe
 * @desc    Transcribe audio to text using OpenAI Whisper
 * @access  Private
 */
export const transcribeAudio = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required",
      });
    }

    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Crear un archivo temporal con el buffer
    const File = (await import("buffer")).File;
    const audioFile = new File([req.file.buffer], "audio.webm", {
      type: req.file.mimetype,
    });

    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: req.body.language || "es", // Español por defecto, puedes hacerlo dinámico
      response_format: "json",
      temperature: 0.2,
    });

    res.status(200).json({
      success: true,
      data: {
        text: response.text,
      },
    });
  } catch (error) {
    console.error("Transcription Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to transcribe audio",
    });
  }
};

export default {
  generate,
  improve,
  suggestions,
  getCredits,
  transcribeAudio,
};
