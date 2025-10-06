import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

// Obtener Access Token
async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString(
    "base64"
  );

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
}

// Crear producto
async function createProduct(accessToken, name, description) {
  const response = await axios.post(
    `${PAYPAL_API}/v1/catalogs/products`,
    {
      name,
      description,
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
}

// Crear plan de suscripción
async function createPlan(accessToken, productId, name, price) {
  const response = await axios.post(
    `${PAYPAL_API}/v1/billing/plans`,
    {
      product_id: productId,
      name,
      description: `${name} - AI Website Builder`,
      status: "ACTIVE", // ⭐ Crear directamente como ACTIVE
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
              value: price.toString(),
              currency_code: "USD",
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: "0",
          currency_code: "USD",
        },
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
      },
      taxes: {
        percentage: "0",
        inclusive: false,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.id;
}

// Script principal
async function main() {
  try {
    console.log("🚀 Creando planes en PayPal...\n");

    const accessToken = await getAccessToken();
    console.log("✅ Autenticado con PayPal\n");

    // Crear producto principal
    console.log("📦 Creando producto...");
    const productId = await createProduct(
      accessToken,
      "AI Website Builder Subscription",
      "Monthly subscription plans for AI Website Builder"
    );
    console.log(`✅ Producto creado: ${productId}\n`);

    // Crear planes
    const plans = [
      { name: "Basic Plan", price: 9 },
      { name: "Pro Plan", price: 19 },
      { name: "Enterprise Plan", price: 99 },
    ];

    const planIds = [];

    for (const plan of plans) {
      console.log(`📋 Creando ${plan.name}...`);
      const planId = await createPlan(
        accessToken,
        productId,
        plan.name,
        plan.price
      );
      console.log(`   Plan ID: ${planId}`);
      console.log(`   ✅ Plan creado y activado\n`);

      planIds.push({ name: plan.name, id: planId, price: plan.price });
    }

    // Mostrar resumen
    console.log("\n" + "=".repeat(70));
    console.log("🎉 TODOS LOS PLANES CREADOS EXITOSAMENTE");
    console.log("=".repeat(70));
    console.log("\n📋 Copia estos IDs a tu archivo .env:\n");

    planIds.forEach((plan) => {
      const envVar = plan.name.includes("Basic")
        ? "PAYPAL_BASIC_PLAN_ID"
        : plan.name.includes("Pro")
        ? "PAYPAL_PRO_PLAN_ID"
        : "PAYPAL_ENTERPRISE_PLAN_ID";

      console.log(`${envVar}=${plan.id}`);
    });

    console.log("\n" + "=".repeat(70));
    console.log("\n✅ Planes creados:");
    planIds.forEach((plan) => {
      console.log(`   • ${plan.name}: $${plan.price}/mes - ID: ${plan.id}`);
    });
    console.log("\n" + "=".repeat(70));

    console.log("\n🔗 Verificar en PayPal:");
    console.log("   https://www.sandbox.paypal.com");
    console.log("   → Productos y Servicios → Planes de Suscripción\n");
  } catch (error) {
    console.error("\n❌ ERROR:", error.response?.data || error.message);
    console.error("\n📝 Detalles completos:");
    console.error(JSON.stringify(error.response?.data, null, 2));

    if (error.response?.data?.name === "UNPROCESSABLE_ENTITY") {
      console.log("\n💡 Tip: Si los planes ya existen, puedes:");
      console.log("   1. Borrarlos desde https://www.sandbox.paypal.com");
      console.log("   2. O usar los IDs existentes directamente");
    }
  }
}

main();
