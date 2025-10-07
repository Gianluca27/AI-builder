/**
 * Script para crear planes de suscripción en PayPal
 * Ejecutar: node create-paypal-plans.js
 */

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const PAYPAL_API =
  process.env.PAYPAL_MODE === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Función para obtener Access Token
async function getAccessToken() {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

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
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error getting access token:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Función para crear un producto en PayPal
async function createProduct(accessToken, name, description) {
  try {
    const response = await axios.post(
      `${PAYPAL_API}/v1/catalogs/products`,
      {
        name: name,
        description: description,
        type: "SERVICE",
        category: "SOFTWARE",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.id;
  } catch (error) {
    console.error(
      `Error creating product ${name}:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

// Función para crear un plan de suscripción
async function createPlan(accessToken, productId, planData) {
  try {
    const response = await axios.post(
      `${PAYPAL_API}/v1/billing/plans`,
      {
        product_id: productId,
        name: planData.name,
        description: planData.description,
        billing_cycles: [
          {
            frequency: {
              interval_unit: "MONTH",
              interval_count: 1,
            },
            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: 0, // 0 = infinito
            pricing_scheme: {
              fixed_price: {
                value: planData.price,
                currency_code: "USD",
              },
            },
          },
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee_failure_action: "CONTINUE",
          payment_failure_threshold: 3,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error creating plan ${planData.name}:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

// Función para activar un plan
async function activatePlan(accessToken, planId) {
  try {
    await axios.post(
      `${PAYPAL_API}/v1/billing/plans/${planId}/activate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    // Si el plan ya está activo, ignorar el error
    if (error.response?.status !== 422) {
      console.error(
        "Error activating plan:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

// Planes a crear
const plans = [
  {
    name: "Basic Plan",
    description: "100 AI generations per month",
    price: "9.00",
  },
  {
    name: "Pro Plan",
    description: "300 AI generations per month",
    price: "19.00",
  },
  {
    name: "Enterprise Plan",
    description: "Unlimited AI generations",
    price: "99.00",
  },
];

// Función principal
async function main() {
  console.log("🚀 Starting PayPal plans creation...\n");

  try {
    // 1. Obtener Access Token
    console.log("📝 Getting PayPal access token...");
    const accessToken = await getAccessToken();
    console.log("✅ Access token obtained\n");

    const createdPlans = [];

    // 2. Crear cada plan
    for (const planData of plans) {
      console.log(`📦 Creating product: ${planData.name}...`);
      const productId = await createProduct(
        accessToken,
        planData.name,
        planData.description
      );
      console.log(`✅ Product created: ${productId}`);

      console.log(`📋 Creating billing plan: ${planData.name}...`);
      const plan = await createPlan(accessToken, productId, planData);
      console.log(`✅ Plan created: ${plan.id}`);

      console.log(`⚡ Activating plan: ${plan.id}...`);
      await activatePlan(accessToken, plan.id);
      console.log(`✅ Plan activated\n`);

      createdPlans.push({
        name: planData.name,
        planId: plan.id,
        productId: productId,
        price: planData.price,
      });
    }

    // 3. Mostrar resultados
    console.log("\n🎉 ALL PLANS CREATED SUCCESSFULLY!\n");
    console.log("=".repeat(60));
    console.log("\n📋 Copy these Plan IDs to your frontend/.env:\n");

    console.log("# Plan IDs de PayPal");
    createdPlans.forEach((plan, index) => {
      const envName = plan.name.split(" ")[0].toUpperCase();
      console.log(`VITE_PAYPAL_${envName}_PLAN_ID=${plan.planId}`);
    });

    console.log("\n" + "=".repeat(60));
    console.log("\n📊 Plan Details:\n");
    createdPlans.forEach((plan) => {
      console.log(`${plan.name}:`);
      console.log(`  Plan ID: ${plan.planId}`);
      console.log(`  Product ID: ${plan.productId}`);
      console.log(`  Price: $${plan.price}/month\n`);
    });
  } catch (error) {
    console.error("\n❌ Error creating plans:", error.message);
    process.exit(1);
  }
}

// Ejecutar
main();
