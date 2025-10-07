/**
 * Script para verificar credenciales de PayPal
 * Ejecutar: node test-paypal-credentials.js
 */

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

console.log("🔍 Testing PayPal credentials...\n");

// Mostrar lo que se está usando (ocultar parte del secret)
console.log("📋 Configuration:");
console.log(`   Mode: ${process.env.PAYPAL_MODE || "NOT SET"}`);
console.log(
  `   Client ID: ${
    process.env.PAYPAL_CLIENT_ID
      ? process.env.PAYPAL_CLIENT_ID.substring(0, 20) + "..."
      : "NOT SET"
  }`
);
console.log(
  `   Client Secret: ${
    process.env.PAYPAL_CLIENT_SECRET
      ? "***" +
        process.env.PAYPAL_CLIENT_SECRET.substring(
          process.env.PAYPAL_CLIENT_SECRET.length - 4
        )
      : "NOT SET"
  }\n`
);

// Verificar que existan las variables
if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
  console.error(
    "❌ ERROR: PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET not found in .env"
  );
  console.log("\n💡 Make sure your backend/.env has:");
  console.log("   PAYPAL_CLIENT_ID=your_client_id");
  console.log("   PAYPAL_CLIENT_SECRET=your_client_secret");
  console.log("   PAYPAL_MODE=sandbox\n");
  process.exit(1);
}

const PAYPAL_API =
  process.env.PAYPAL_MODE === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

async function testCredentials() {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  console.log(`🌐 Testing connection to: ${PAYPAL_API}\n`);

  try {
    const response = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("✅ SUCCESS! Credentials are valid\n");
    console.log("📝 Access Token obtained:");
    console.log(`   ${response.data.access_token.substring(0, 50)}...\n`);
    console.log("🎉 Your PayPal credentials are working correctly!");
    console.log("   You can now run: node create-paypal-plans.js\n");
  } catch (error) {
    console.error("❌ FAILED! Credentials are invalid\n");

    if (error.response) {
      console.error("Error details:");
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Error: ${error.response.data.error}`);
      console.error(
        `   Description: ${error.response.data.error_description}\n`
      );

      console.log("💡 Common issues:");
      console.log("   1. Wrong Client ID or Secret");
      console.log(
        "   2. Using Production credentials in Sandbox mode (or vice versa)"
      );
      console.log("   3. Extra spaces or quotes in .env file");
      console.log("   4. App not properly created in PayPal Dashboard\n");

      console.log("🔧 How to fix:");
      console.log("   1. Go to: https://developer.paypal.com/dashboard/");
      console.log("   2. Click 'Apps & Credentials'");
      console.log("   3. Make sure you're in 'Sandbox' mode (toggle at top)");
      console.log("   4. Create a new app or open existing one");
      console.log(
        "   5. Copy Client ID and Secret (click 'Show' to see secret)"
      );
      console.log("   6. Paste them in backend/.env WITHOUT quotes\n");
    } else {
      console.error("Error:", error.message);
    }

    process.exit(1);
  }
}

testCredentials();
