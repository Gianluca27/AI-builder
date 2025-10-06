import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["landing", "portfolio", "dashboard", "blog", "ecommerce", "other"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    htmlCode: {
      type: String,
      required: true,
    },
    cssCode: {
      type: String,
      default: "",
    },
    jsCode: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: null,
    },
    preview: {
      type: String,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPremium: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    author: {
      type: String,
      default: "AI Builder Team",
    },
  },
  {
    timestamps: true,
  }
);

// Índices
templateSchema.index({ category: 1, isActive: 1 });
templateSchema.index({ isPremium: 1 });
templateSchema.index({ "rating.average": -1 });
templateSchema.index({ usageCount: -1 });

// Método para incrementar uso
templateSchema.methods.incrementUsage = async function () {
  this.usageCount += 1;
  await this.save({ validateBeforeSave: false });
};

const Template = mongoose.model("Template", templateSchema);

export default Template;
