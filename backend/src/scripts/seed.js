import mongoose from "mongoose";
import dotenv from "dotenv";
import Template from "../models/Template.model.js";

dotenv.config();

const templates = [
  {
    name: "Modern Landing Page",
    category: "landing",
    description:
      "A modern landing page with gradient hero, features section, and CTA",
    htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Landing Page</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
        }
        h1 { font-size: 4rem; margin-bottom: 1rem; }
        p { font-size: 1.5rem; margin-bottom: 2rem; opacity: 0.9; }
        .cta {
            background: white;
            color: #667eea;
            padding: 15px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            transition: transform 0.3s;
        }
        .cta:hover { transform: translateY(-3px); }
    </style>
</head>
<body>
    <div class="hero">
        <div>
            <h1>Welcome to the Future</h1>
            <p>Build amazing experiences with modern technology</p>
            <a href="#" class="cta">Get Started</a>
        </div>
    </div>
</body>
</html>`,
    tags: ["modern", "gradient", "hero", "responsive"],
    isPremium: false,
    isActive: true,
  },
  {
    name: "Creative Portfolio",
    category: "portfolio",
    description: "Dark themed portfolio with project grid and animations",
    htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Courier New', monospace;
            background: #0a0a0a;
            color: #fff;
        }
        .header {
            padding: 100px 20px;
            text-align: center;
            background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
        }
        h1 {
            font-size: 4rem;
            background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .projects {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            padding: 80px 40px;
            max-width: 1400px;
            margin: 0 auto;
        }
        .project {
            background: #1a1a1a;
            border-radius: 15px;
            overflow: hidden;
            transition: transform 0.3s;
        }
        .project:hover { transform: translateY(-10px); }
        .project-image {
            height: 250px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
        }
        .project-info { padding: 25px; }
        .project-info h3 { color: #f093fb; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>John Doe</h1>
        <p style="color: #888;">Creative Developer & Designer</p>
    </div>
    <div class="projects">
        <div class="project">
            <div class="project-image">🎨</div>
            <div class="project-info">
                <h3>Project Alpha</h3>
                <p style="color: #aaa;">Innovative design meets cutting-edge technology</p>
            </div>
        </div>
        <div class="project">
            <div class="project-image">🚀</div>
            <div class="project-info">
                <h3>Project Beta</h3>
                <p style="color: #aaa;">Modern web platform built with latest tech</p>
            </div>
        </div>
        <div class="project">
            <div class="project-image">💎</div>
            <div class="project-info">
                <h3>Project Gamma</h3>
                <p style="color: #aaa;">Exceptional UX with smooth animations</p>
            </div>
        </div>
    </div>
</body>
</html>`,
    tags: ["dark", "portfolio", "grid", "gradient"],
    isPremium: false,
    isActive: true,
  },
  {
    name: "Analytics Dashboard",
    category: "dashboard",
    description: "Professional dashboard with sidebar and stats cards",
    htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: grid;
            grid-template-columns: 250px 1fr;
            min-height: 100vh;
            background: #f5f5f5;
        }
        .sidebar {
            background: #2c3e50;
            color: white;
            padding: 30px 20px;
        }
        .sidebar h2 { margin-bottom: 30px; color: #3498db; }
        .nav-item {
            padding: 12px;
            margin: 8px 0;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .nav-item:hover { background: #34495e; }
        .main {
            padding: 30px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .stat-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: #2c3e50;
        }
        .stat-label {
            color: #7f8c8d;
            font-size: 0.9rem;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <h2>📊 Dashboard</h2>
        <div class="nav-item">📈 Analytics</div>
        <div class="nav-item">👥 Users</div>
        <div class="nav-item">💰 Revenue</div>
        <div class="nav-item">⚙️ Settings</div>
    </div>
    <div class="main">
        <h1>Overview</h1>
        <div class="stats">
            <div class="stat-card">
                <div class="stat-label">Total Users</div>
                <div class="stat-value">24,567</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Revenue</div>
                <div class="stat-value">$145K</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Conversion</div>
                <div class="stat-value">3.24%</div>
            </div>
        </div>
    </div>
</body>
</html>`,
    tags: ["dashboard", "admin", "stats", "sidebar"],
    isPremium: false,
    isActive: true,
  },
  {
    name: "Minimal Blog",
    category: "blog",
    description: "Clean blog layout with elegant typography",
    htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minimal Blog</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Georgia, serif;
            line-height: 1.8;
            color: #2d3748;
            background: #f7fafc;
        }
        header {
            background: white;
            text-align: center;
            padding: 80px 20px;
            border-bottom: 1px solid #e2e8f0;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            color: #1a202c;
        }
        .container {
            max-width: 800px;
            margin: 60px auto;
            padding: 0 20px;
        }
        .article {
            background: white;
            padding: 60px 50px;
            margin-bottom: 40px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .article h2 {
            font-size: 2rem;
            margin-bottom: 15px;
            color: #1a202c;
        }
        .article-meta {
            color: #a0aec0;
            font-size: 0.9rem;
            margin-bottom: 25px;
        }
    </style>
</head>
<body>
    <header>
        <h1>The Blog</h1>
        <p style="color: #718096;">Thoughts on design, development, and life</p>
    </header>
    <div class="container">
        <article class="article">
            <h2>The Art of Simplicity in Web Design</h2>
            <div class="article-meta">October 5, 2025 · 5 min read</div>
            <p>In a world of increasingly complex interfaces, there's something powerful about simplicity...</p>
        </article>
        <article class="article">
            <h2>Building for the Modern Web</h2>
            <div class="article-meta">October 1, 2025 · 7 min read</div>
            <p>The web has evolved dramatically over the past decade...</p>
        </article>
    </div>
</body>
</html>`,
    tags: ["blog", "minimal", "typography", "clean"],
    isPremium: false,
    isActive: true,
  },
  {
    name: "E-commerce Store",
    category: "ecommerce",
    description: "Product showcase with shopping cart",
    htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Store</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .header {
            background: white;
            padding: 20px 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo { font-size: 1.5rem; font-weight: 700; }
        .hero {
            background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
            padding: 100px 40px;
            text-align: center;
        }
        .products {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 30px;
            padding: 80px 40px;
            max-width: 1400px;
            margin: 0 auto;
        }
        .product {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            transition: transform 0.3s;
        }
        .product:hover { transform: translateY(-8px); }
        .product-image {
            height: 300px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
        }
        .product-info { padding: 20px; }
        .product-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: #e74c3c;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🛍️ STORE</div>
        <div>🛒 Cart (0)</div>
    </div>
    <div class="hero">
        <h1 style="font-size: 3.5rem;">New Collection</h1>
        <p style="font-size: 1.3rem;">Discover latest products with free shipping</p>
    </div>
    <div class="products">
        <div class="product">
            <div class="product-image">👕</div>
            <div class="product-info">
                <h3>Premium T-Shirt</h3>
                <div class="product-price">$29.99</div>
            </div>
        </div>
        <div class="product">
            <div class="product-image">👟</div>
            <div class="product-info">
                <h3>Sport Sneakers</h3>
                <div class="product-price">$89.99</div>
            </div>
        </div>
    </div>
</body>
</html>`,
    tags: ["ecommerce", "shop", "products", "modern"],
    isPremium: false,
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing templates
    await Template.deleteMany({});
    console.log("🗑️  Cleared existing templates");

    // Insert new templates
    const result = await Template.insertMany(templates);
    console.log(`✅ Seeded ${result.length} templates`);

    console.log("\n📦 Templates created:");
    result.forEach((t) => {
      console.log(`   - ${t.name} (${t.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
