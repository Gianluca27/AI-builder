import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ============= SISTEMA DE BILLING =============

    plan: {
      type: String,
      enum: ["free", "basic", "pro", "enterprise"],
      default: "free",
    },

    credits: {
      type: Number,
      default: 10,
    },

    subscription: {
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      stripePriceId: String,
      status: {
        type: String,
        enum: ["active", "canceled", "past_due", "unpaid"],
        default: null,
      },
      currentPeriodStart: Date,
      currentPeriodEnd: Date,
      cancelAtPeriodEnd: Boolean,
    },

    usage: {
      totalGenerations: { type: Number, default: 0 },
      thisMonthGenerations: { type: Number, default: 0 },
      lastResetDate: { type: Date, default: Date.now },
      totalSpent: { type: Number, default: 0 },
    },

    purchases: [
      {
        amount: Number,
        credits: Number,
        date: { type: Date, default: Date.now },
        stripePaymentIntentId: String,
      },
    ],

    avatar: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual para proyectos
userSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "user",
});

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Comparar password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Actualizar último login
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = Date.now();
  await this.save({ validateBeforeSave: false });
};

// Verificar créditos
userSchema.methods.hasCredits = function () {
  return this.credits > 0;
};

// Usar crédito
userSchema.methods.useCredit = async function () {
  if (this.credits > 0) {
    this.credits -= 1;
    this.usage.totalGenerations += 1;
    this.usage.thisMonthGenerations += 1;
    await this.save({ validateBeforeSave: false });
    return true;
  }
  return false;
};

// Agregar créditos
userSchema.methods.addCredits = async function (amount, purchaseData = {}) {
  this.credits += amount;

  if (purchaseData.stripePaymentIntentId) {
    this.purchases.push({
      amount: purchaseData.amount || 0,
      credits: amount,
      stripePaymentIntentId: purchaseData.stripePaymentIntentId,
    });
  }

  await this.save({ validateBeforeSave: false });
};

// Reset mensual
userSchema.methods.resetMonthlyUsage = async function () {
  const now = new Date();
  const lastReset = this.usage.lastResetDate;

  if (
    now.getMonth() !== lastReset.getMonth() ||
    now.getFullYear() !== lastReset.getFullYear()
  ) {
    this.usage.thisMonthGenerations = 0;
    this.usage.lastResetDate = now;

    if (this.plan === "basic") {
      this.credits = 100;
    } else if (this.plan === "pro") {
      this.credits = 300;
    }

    await this.save({ validateBeforeSave: false });
  }
};

// Verificar si puede generar
userSchema.methods.canGenerate = function () {
  if (this.plan === "enterprise") {
    return true;
  }

  if (this.plan === "pro" && this.usage.thisMonthGenerations < 300) {
    return true;
  }

  if (this.plan === "basic" && this.usage.thisMonthGenerations < 100) {
    return true;
  }

  if (this.plan === "free" && this.credits > 0) {
    return true;
  }

  return false;
};

const User = mongoose.model("User", userSchema);

export default User;
