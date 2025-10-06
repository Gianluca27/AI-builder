import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Genera código HTML/CSS/JS usando GPT-4
 */
export const generateWebsiteCode = async (prompt, options = {}) => {
  const {
    type = "custom",
    style = "modern",
    includeJS = false,
    responsive = true,
  } = options;

  const systemPrompt = `You are an expert web developer. Generate complete, production-ready HTML code based on user requirements.

REQUIREMENTS:
- Generate semantic, modern HTML5
- Include inline CSS within <style> tags (use modern CSS features like Grid, Flexbox)
- Make it fully responsive (mobile-first approach)
- Use modern design principles (clean, professional, accessible)
- NO external dependencies (no CDN links, no external libraries)
- Code must be complete and ready to use immediately
- Include proper meta tags for SEO
- Use CSS variables for theming
${
  includeJS
    ? "- Include minimal, vanilla JavaScript if needed for interactivity"
    : "- NO JavaScript unless absolutely necessary"
}

STYLE: ${style}
TYPE: ${type}

OUTPUT FORMAT:
Return ONLY valid HTML code, nothing else. No explanations, no markdown code blocks, just pure HTML.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const generatedCode = completion.choices[0].message.content.trim();

    // Extraer HTML, CSS y JS si están separados
    const htmlCode = extractHTML(generatedCode);
    const cssCode = extractCSS(generatedCode);
    const jsCode = extractJS(generatedCode);

    // Detectar tipo automáticamente si no se especificó
    const detectedType = detectWebsiteType(htmlCode);

    return {
      success: true,
      htmlCode,
      cssCode,
      jsCode,
      type: type === "custom" ? detectedType : type,
      tokensUsed: completion.usage.total_tokens,
      model: completion.model,
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);

    if (error.status === 401) {
      throw new Error("Invalid OpenAI API key");
    } else if (error.status === 429) {
      throw new Error("OpenAI rate limit exceeded. Please try again later.");
    } else if (error.status === 500) {
      throw new Error("OpenAI service error. Please try again.");
    }

    throw new Error("Failed to generate website code");
  }
};

/**
 * Mejora código existente usando GPT-4
 */
export const improveCode = async (currentCode, improvements) => {
  const systemPrompt = `You are an expert web developer. Improve the given HTML code based on user requirements.
  
Return ONLY the improved HTML code, nothing else.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Current code:\n\n${currentCode}\n\nImprovements requested:\n${improvements}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const improvedCode = completion.choices[0].message.content.trim();

    return {
      success: true,
      htmlCode: extractHTML(improvedCode),
      tokensUsed: completion.usage.total_tokens,
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to improve code");
  }
};

/**
 * Genera sugerencias de diseño basadas en el prompt
 */
export const generateDesignSuggestions = async (prompt) => {
  const systemPrompt = `You are a UX/UI design expert. Based on the user's website idea, suggest:
1. Color palette (3-5 colors with hex codes)
2. Font suggestions
3. Layout recommendations
4. Key features to include

Return as JSON object with keys: colors, fonts, layout, features`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const suggestions = JSON.parse(completion.choices[0].message.content);

    return {
      success: true,
      suggestions,
      tokensUsed: completion.usage.total_tokens,
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate design suggestions");
  }
};

/**
 * Extrae HTML del código generado
 */
function extractHTML(code) {
  // Si ya es HTML completo, retornar tal cual
  if (code.includes("<!DOCTYPE html>") || code.includes("<html")) {
    return code;
  }

  // Si está en markdown code block, extraer
  const htmlMatch = code.match(/```html\n([\s\S]*?)\n```/);
  if (htmlMatch) {
    return htmlMatch[1];
  }

  return code;
}

/**
 * Extrae CSS del código si está separado
 */
function extractCSS(code) {
  const cssMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/);
  return cssMatch ? cssMatch[1] : "";
}

/**
 * Extrae JS del código si está separado
 */
function extractJS(code) {
  const jsMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/);
  return jsMatch ? jsMatch[1] : "";
}

/**
 * Detecta el tipo de sitio web basándose en el contenido
 */
function detectWebsiteType(htmlCode) {
  const lower = htmlCode.toLowerCase();

  if (
    lower.includes("dashboard") ||
    lower.includes("sidebar") ||
    lower.includes("stats")
  ) {
    return "dashboard";
  }
  if (
    lower.includes("portfolio") ||
    lower.includes("projects") ||
    lower.includes("gallery")
  ) {
    return "portfolio";
  }
  if (
    lower.includes("blog") ||
    lower.includes("article") ||
    lower.includes("post")
  ) {
    return "blog";
  }
  if (
    lower.includes("shop") ||
    lower.includes("product") ||
    lower.includes("cart")
  ) {
    return "ecommerce";
  }
  if (
    lower.includes("hero") ||
    lower.includes("cta") ||
    lower.includes("features")
  ) {
    return "landing";
  }

  return "custom";
}

export default {
  generateWebsiteCode,
  improveCode,
  generateDesignSuggestions,
};
