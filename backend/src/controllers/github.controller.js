import User from "../models/User.model.js";
import axios from "axios";

// GitHub OAuth Configuration
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URI =
  process.env.GITHUB_REDIRECT_URI ||
  "http://localhost:5000/api/github/callback";

/**
 * @route   GET /api/github/auth
 * @desc    Initiate GitHub OAuth flow
 * @access  Private
 */
export const initiateGithubAuth = async (req, res) => {
  try {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=repo,user`;

    res.json({
      success: true,
      data: { authUrl },
    });
  } catch (error) {
    console.error("GitHub auth initiation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initiate GitHub authentication",
    });
  }
};

/**
 * @route   GET /api/github/callback
 * @desc    Handle GitHub OAuth callback
 * @access  Public
 */
export const handleGithubCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code not provided",
      });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: GITHUB_REDIRECT_URI,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Failed to obtain access token",
      });
    }

    // Get user's GitHub info
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const githubUser = userResponse.data;

    // Store GitHub token in user's account
    // NOTE: This assumes the user is already logged in to the app
    // In a real implementation, you'd need to link this to the current user session

    // Redirect to frontend callback with token in URL
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const redirectUrl = `${FRONTEND_URL}/github/callback?success=true&token=${accessToken}&username=${githubUser.login}`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("GitHub callback error:", error);

    // Redirect to frontend callback with error
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const errorMessage = encodeURIComponent(error.message || "Failed to authenticate with GitHub");
    const redirectUrl = `${FRONTEND_URL}/github/callback?success=false&error=${errorMessage}`;

    res.redirect(redirectUrl);
  }
};

/**
 * @route   POST /api/github/create-repo
 * @desc    Create a new GitHub repository with project code
 * @access  Private
 */
export const createRepository = async (req, res) => {
  try {
    const {
      repoName,
      repoDescription,
      isPrivate,
      htmlCode,
      cssCode,
      jsCode,
      githubToken,
    } = req.body;

    if (!repoName || !githubToken) {
      return res.status(400).json({
        success: false,
        message: "Repository name and GitHub token are required",
      });
    }

    // Create repository
    const repoResponse = await axios.post(
      "https://api.github.com/user/repos",
      {
        name: repoName,
        description: repoDescription || "Generated with AI Builder",
        private: isPrivate || false,
        auto_init: true,
      },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const repo = repoResponse.data;

    // Create README.md
    const readmeContent = Buffer.from(
      `# ${repoName}\n\n${
        repoDescription || "Generated with AI Builder"
      }\n\n## Built with\n- HTML\n- CSS\n- JavaScript\n- AI Builder (https://aibuilder.com)`
    ).toString("base64");

    await axios.put(
      `https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/README.md`,
      {
        message: "Initial commit: Add README",
        content: readmeContent,
      },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    // Create index.html with all code
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${repoName}</title>
    ${cssCode ? `<style>${cssCode}</style>` : ""}
</head>
<body>
${htmlCode || ""}
${jsCode ? `<script>${jsCode}</script>` : ""}
</body>
</html>`;

    const htmlContent = Buffer.from(fullHTML).toString("base64");

    await axios.put(
      `https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/index.html`,
      {
        message: "Add website code",
        content: htmlContent,
      },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    // Optionally create separate CSS and JS files if they exist
    if (cssCode) {
      const cssContent = Buffer.from(cssCode).toString("base64");
      await axios.put(
        `https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/styles.css`,
        {
          message: "Add styles",
          content: cssContent,
        },
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
    }

    if (jsCode) {
      const jsContent = Buffer.from(jsCode).toString("base64");
      await axios.put(
        `https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/script.js`,
        {
          message: "Add JavaScript",
          content: jsContent,
        },
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
    }

    res.json({
      success: true,
      data: {
        repoUrl: repo.html_url,
        repoName: repo.name,
        fullName: repo.full_name,
        owner: repo.owner.login,
      },
      message: "Repository created successfully",
    });
  } catch (error) {
    console.error("Create repository error:", error.response?.data || error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || "Failed to create repository",
    });
  }
};

/**
 * @route   POST /api/github/update-repo
 * @desc    Update existing repository with new code
 * @access  Private
 */
export const updateRepository = async (req, res) => {
  try {
    const {
      repoFullName,
      htmlCode,
      cssCode,
      jsCode,
      githubToken,
      commitMessage,
    } = req.body;

    if (!repoFullName || !githubToken) {
      return res.status(400).json({
        success: false,
        message: "Repository name and GitHub token are required",
      });
    }

    // Get current file SHA (required for updates)
    const currentFileResponse = await axios.get(
      `https://api.github.com/repos/${repoFullName}/contents/index.html`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const currentSHA = currentFileResponse.data.sha;

    // Update index.html
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${repoFullName.split("/")[1]}</title>
    ${cssCode ? `<style>${cssCode}</style>` : ""}
</head>
<body>
${htmlCode || ""}
${jsCode ? `<script>${jsCode}</script>` : ""}
</body>
</html>`;

    const htmlContent = Buffer.from(fullHTML).toString("base64");

    await axios.put(
      `https://api.github.com/repos/${repoFullName}/contents/index.html`,
      {
        message: commitMessage || "Update website code",
        content: htmlContent,
        sha: currentSHA,
      },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    res.json({
      success: true,
      message: "Repository updated successfully",
    });
  } catch (error) {
    console.error("Update repository error:", error.response?.data || error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || "Failed to update repository",
    });
  }
};

/**
 * @route   GET /api/github/repos
 * @desc    List user's GitHub repositories
 * @access  Private
 */
export const listRepositories = async (req, res) => {
  try {
    const { githubToken } = req.body;

    if (!githubToken) {
      return res.status(400).json({
        success: false,
        message: "GitHub token is required",
      });
    }

    // Get user's repositories
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      params: {
        sort: "updated",
        per_page: 100,
      },
    });

    const repos = response.data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      private: repo.private,
      language: repo.language,
      updatedAt: repo.updated_at,
      hasPages: repo.has_pages,
    }));

    res.json({
      success: true,
      data: { repositories: repos },
    });
  } catch (error) {
    console.error("List repositories error:", error.response?.data || error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || "Failed to fetch repositories",
    });
  }
};

/**
 * @route   POST /api/github/read-repo
 * @desc    Read content from a GitHub repository
 * @access  Private
 */
export const readRepository = async (req, res) => {
  try {
    const { repoFullName, githubToken } = req.body;

    if (!repoFullName || !githubToken) {
      return res.status(400).json({
        success: false,
        message: "Repository name and GitHub token are required",
      });
    }

    // Get repository contents
    const contentsResponse = await axios.get(
      `https://api.github.com/repos/${repoFullName}/contents`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const files = contentsResponse.data;
    let htmlContent = "";
    let cssContent = "";
    let jsContent = "";

    // Read main files (index.html, styles.css, script.js)
    for (const file of files) {
      if (file.type === "file") {
        const fileResponse = await axios.get(file.download_url);
        const content = fileResponse.data;

        if (file.name === "index.html" || file.name.endsWith(".html")) {
          htmlContent = content;
        } else if (file.name.endsWith(".css")) {
          cssContent += content + "\n";
        } else if (
          file.name.endsWith(".js") &&
          !file.name.includes(".config") &&
          !file.name.includes(".test")
        ) {
          jsContent += content + "\n";
        }
      }
    }

    // If no separate HTML file, try to extract from index
    if (!htmlContent && files.find((f) => f.name === "index.html")) {
      const indexFile = files.find((f) => f.name === "index.html");
      const indexResponse = await axios.get(indexFile.download_url);
      htmlContent = indexResponse.data;
    }

    // Extract embedded CSS and JS from HTML if needed
    if (htmlContent) {
      if (!cssContent) {
        const cssMatch = htmlContent.match(/<style[^>]*>([\s\S]*?)<\/style>/);
        if (cssMatch) cssContent = cssMatch[1];
      }
      if (!jsContent) {
        const jsMatch = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/);
        if (jsMatch) jsContent = jsMatch[1];
      }
    }

    res.json({
      success: true,
      data: {
        htmlCode: htmlContent,
        cssCode: cssContent,
        jsCode: jsContent,
        repoName: repoFullName.split("/")[1],
      },
      message: "Repository content loaded successfully",
    });
  } catch (error) {
    console.error("Read repository error:", error.response?.data || error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || "Failed to read repository",
    });
  }
};

/**
 * @route   POST /api/github/disconnect
 * @desc    Disconnect GitHub account
 * @access  Private
 */
export const disconnectGithub = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove GitHub token from user
    user.githubToken = undefined;
    user.githubUsername = undefined;
    await user.save();

    res.json({
      success: true,
      message: "GitHub account disconnected",
    });
  } catch (error) {
    console.error("Disconnect GitHub error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to disconnect GitHub account",
    });
  }
};
