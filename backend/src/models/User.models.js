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
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    credits: {
      type: Number,
      default: 10, // Free plan gets 10 AI generations
    },
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
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

// Virtual para proyectos del usuario
userSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "user",
});

// Hash password antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para actualizar último login
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = Date.now();
  await this.save({ validateBeforeSave: false });
};

// Método para verificar créditos
userSchema.methods.hasCredits = function () {
  return this.credits > 0;
};

// Método para consumir créditos
userSchema.methods.useCredit = async function () {
  if (this.credits > 0) {
    this.credits -= 1;
    await this.save({ validateBeforeSave: false });
    return true;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

export default User;
