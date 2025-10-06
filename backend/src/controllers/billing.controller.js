import axios from "axios";
import User from "../models/User.model.js";

// ============= CONFIGURACIÓN PAYPAL =============
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

// Función para obtener Access Token de PayPal
async function getPayPalAccessToken() {
  try {
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
  } catch (error) {
    console.error("PayPal Auth Error:", error.response?.data || error.message);
    throw new Error("Failed to authenticate with PayPal");
  }
}

// ============= PLANES =============
const PLANS = {
  free: {
    name: "Free",
    price: 0,
    credits: 10,
    planId: null,
  },
  basic: {
    name: "Basic",
    price: 9,
    creditsPerMonth: 100,
    planId: process.env.PAYPAL_BASIC_PLAN_ID,
  },
  pro: {
    name: "Pro",
    price: 19,
    creditsPerMonth: 300,
    planId: process.env.PAYPAL_PRO_PLAN_ID,
  },
  enterprise: {
    name: "Enterprise",
    price: 99,
    unlimited: true,
    planId: process.env.PAYPAL_ENTERPRISE_PLAN_ID,
  },
};

// ============= PAQUETES DE CRÉDITOS =============
const CREDIT_PACKS = {
  small: {
    name: "50 Credits",
    credits: 50,
    price: 5,
  },
  medium: {
    name: "100 Credits",
    credits: 100,
    price: 9,
  },
  large: {
    name: "500 Credits",
    credits: 500,
    price: 40,
  },
};

/**
 * @route   POST /api/billing/create-subscription
 * @desc    Crear suscripción con PayPal
 */
export const createSubscription = async (req, res) => {
  try {
    const { planId } = req.body; // 'basic', 'pro', 'enterprise'
    const userId = req.user.id;

    const plan = PLANS[planId];
    if (!plan || !plan.planId) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan",
      });
    }

    const user = await User.findById(userId);
    const accessToken = await getPayPalAccessToken();

    // Crear suscripción en PayPal
    const response = await axios.post(
      `${PAYPAL_API}/v1/billing/subscriptions`,
      {
        plan_id: plan.planId,
        application_context: {
          brand_name: "AI Website Builder",
          locale: "es-AR",
          shipping_preference: "NO_SHIPPING",
          user_action: "SUBSCRIBE_NOW",
          return_url: `${process.env.FRONTEND_URL}/dashboard?subscription=success`,
          cancel_url: `${process.env.FRONTEND_URL}/pricing?subscription=cancelled`,
        },
        custom_id: user._id.toString(), // Para identificar al usuario en webhook
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const approvalUrl = response.data.links.find(
      (link) => link.rel === "approve"
    ).href;

    res.status(200).json({
      success: true,
      data: {
        subscriptionId: response.data.id,
        approvalUrl,
      },
    });
  } catch (error) {
    console.error(
      "PayPal Subscription Error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Failed to create subscription",
    });
  }
};

/**
 * @route   POST /api/billing/create-order
 * @desc    Crear orden para compra one-time de créditos
 */
export const createOrder = async (req, res) => {
  try {
    const { packId } = req.body; // 'small', 'medium', 'large'
    const userId = req.user.id;

    const pack = CREDIT_PACKS[packId];
    if (!pack) {
      return res.status(400).json({
        success: false,
        message: "Invalid credit pack",
      });
    }

    const user = await User.findById(userId);
    const accessToken = await getPayPalAccessToken();

    // Crear orden en PayPal
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            description: pack.name,
            custom_id: JSON.stringify({
              userId: user._id.toString(),
              packId,
              credits: pack.credits,
            }),
            amount: {
              currency_code: "USD",
              value: pack.price.toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: "AI Website Builder",
          locale: "es-AR",
          landing_page: "NO_PREFERENCE",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          return_url: `${process.env.FRONTEND_URL}/dashboard?credits=purchased`,
          cancel_url: `${process.env.FRONTEND_URL}/pricing?payment=cancelled`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const approvalUrl = response.data.links.find(
      (link) => link.rel === "approve"
    ).href;

    res.status(200).json({
      success: true,
      data: {
        orderId: response.data.id,
        approvalUrl,
      },
    });
  } catch (error) {
    console.error("PayPal Order Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

/**
 * @route   POST /api/billing/capture-order
 * @desc    Capturar pago después de aprobación del usuario
 */
export const captureOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const accessToken = await getPayPalAccessToken();

    // Capturar el pago
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extraer datos
    const captureData = response.data.purchase_units[0].payments.captures[0];
    const customData = JSON.parse(response.data.purchase_units[0].custom_id);

    // Agregar créditos al usuario
    const user = await User.findById(customData.userId);
    await user.addCredits(customData.credits, {
      amount: parseFloat(captureData.amount.value),
      paypalOrderId: orderId,
      paypalCaptureId: captureData.id,
    });

    res.status(200).json({
      success: true,
      message: `${customData.credits} credits added successfully`,
      data: {
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error(
      "PayPal Capture Error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Failed to capture payment",
    });
  }
};

/**
 * @route   POST /api/billing/webhook
 * @desc    PayPal Webhook - Escuchar eventos
 */
export const paypalWebhook = async (req, res) => {
  try {
    const webhookEvent = req.body;

    console.log("📨 PayPal Webhook:", webhookEvent.event_type);

    // Verificar firma (opcional pero recomendado)
    // const isValid = await verifyPayPalWebhook(req);
    // if (!isValid) {
    //   return res.status(400).json({ error: "Invalid webhook signature" });
    // }

    switch (webhookEvent.event_type) {
      // ========== SUSCRIPCIÓN ACTIVADA ==========
      case "BILLING.SUBSCRIPTION.ACTIVATED": {
        const subscription = webhookEvent.resource;
        await handleSubscriptionActivated(subscription);
        break;
      }

      // ========== PAGO DE SUSCRIPCIÓN COMPLETADO ==========
      case "PAYMENT.SALE.COMPLETED": {
        const sale = webhookEvent.resource;
        if (sale.billing_agreement_id) {
          // Es un pago de suscripción
          await handleSubscriptionPayment(sale);
        }
        break;
      }

      // ========== SUSCRIPCIÓN CANCELADA ==========
      case "BILLING.SUBSCRIPTION.CANCELLED": {
        const subscription = webhookEvent.resource;
        await handleSubscriptionCancelled(subscription);
        break;
      }

      // ========== SUSCRIPCIÓN SUSPENDIDA (pago fallido) ==========
      case "BILLING.SUBSCRIPTION.SUSPENDED": {
        const subscription = webhookEvent.resource;
        await handleSubscriptionSuspended(subscription);
        break;
      }

      default:
        console.log(`Unhandled webhook type: ${webhookEvent.event_type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("PayPal Webhook Error:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
};

// ========== HELPER FUNCTIONS ==========

async function handleSubscriptionActivated(subscription) {
  try {
    const userId = subscription.custom_id;
    const user = await User.findById(userId);

    if (!user) {
      console.error("User not found for subscription");
      return;
    }

    const plan = determinePlanFromPlanId(subscription.plan_id);

    user.plan = plan;
    user.subscription = {
      paypalSubscriptionId: subscription.id,
      paypalPlanId: subscription.plan_id,
      paypalPayerId: subscription.subscriber?.payer_id || null,
      status: "ACTIVE",
      nextBillingTime: new Date(subscription.billing_info?.next_billing_time),
      cancelAtPeriodEnd: false,
    };

    // Asignar créditos
    if (plan === "basic") {
      user.credits = 100;
    } else if (plan === "pro") {
      user.credits = 300;
    } else if (plan === "enterprise") {
      user.credits = 999999;
    }

    await user.save();
    console.log(`✅ Subscription activated for user ${user.email} to ${plan}`);
  } catch (error) {
    console.error("Error handling subscription activation:", error);
  }
}

async function handleSubscriptionPayment(sale) {
  try {
    const user = await User.findOne({
      "subscription.paypalSubscriptionId": sale.billing_agreement_id,
    });

    if (!user) return;

    // Reset créditos mensuales
    await user.resetMonthlyUsage();

    console.log(`💰 Payment processed for user ${user.email}`);
  } catch (error) {
    console.error("Error handling subscription payment:", error);
  }
}

async function handleSubscriptionCancelled(subscription) {
  try {
    const user = await User.findOne({
      "subscription.paypalSubscriptionId": subscription.id,
    });

    if (!user) return;

    user.plan = "free";
    user.credits = 10;
    user.subscription.status = "CANCELLED";

    await user.save();
    console.log(`❌ Subscription cancelled for user ${user.email}`);
  } catch (error) {
    console.error("Error handling subscription cancellation:", error);
  }
}

async function handleSubscriptionSuspended(subscription) {
  try {
    const user = await User.findOne({
      "subscription.paypalSubscriptionId": subscription.id,
    });

    if (!user) return;

    user.subscription.status = "SUSPENDED";
    await user.save();

    console.log(`⚠️ Subscription suspended for user ${user.email}`);
  } catch (error) {
    console.error("Error handling subscription suspension:", error);
  }
}

function determinePlanFromPlanId(planId) {
  if (planId === process.env.PAYPAL_BASIC_PLAN_ID) return "basic";
  if (planId === process.env.PAYPAL_PRO_PLAN_ID) return "pro";
  if (planId === process.env.PAYPAL_ENTERPRISE_PLAN_ID) return "enterprise";
  return "free";
}

/**
 * @route   GET /api/billing/plans
 * @desc    Obtener planes disponibles
 */
export const getPlans = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      plans: PLANS,
      creditPacks: CREDIT_PACKS,
    },
  });
};

/**
 * @route   POST /api/billing/cancel-subscription
 * @desc    Cancelar suscripción
 */
export const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.subscription?.paypalSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: "No active subscription",
      });
    }

    const accessToken = await getPayPalAccessToken();

    // Cancelar en PayPal
    await axios.post(
      `${PAYPAL_API}/v1/billing/subscriptions/${user.subscription.paypalSubscriptionId}/cancel`,
      {
        reason: "User requested cancellation",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    user.subscription.status = "CANCELLED";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    console.error(
      "Cancel Subscription Error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Failed to cancel subscription",
    });
  }
};

/**
 * @route   GET /api/billing/usage
 * @desc    Obtener uso actual
 */
export const getUsage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        plan: user.plan,
        credits: user.credits,
        usage: user.usage,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch usage",
    });
  }
};

export default {
  createSubscription,
  createOrder,
  captureOrder,
  paypalWebhook,
  getPlans,
  cancelSubscription,
  getUsage,
};
