import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please provide a project name"],
      trim: true,
      maxlength: [100, "Project name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    prompt: {
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
    type: {
      type: String,
      enum: [
        "landing",
        "portfolio",
        "dashboard",
        "blog",
        "ecommerce",
        "custom",
      ],
      default: "custom",
    },
    template: {
      type: String,
      default: null,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    customizations: {
      colors: {
        primary: { type: String, default: "#667eea" },
        secondary: { type: String, default: "#764ba2" },
      },
      fonts: {
        heading: { type: String, default: "sans-serif" },
        body: { type: String, default: "sans-serif" },
      },
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
    },
    deployUrl: {
      type: String,
      default: null,
    },
    lastEdited: {
      type: Date,
      default: Date.now,
    },
    version: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Índices para búsqueda y performance
projectSchema.index({ user: 1, createdAt: -1 });
projectSchema.index({ isPublic: 1, views: -1 });
projectSchema.index({ type: 1 });
projectSchema.index({ tags: 1 });

// Virtual para contar likes
projectSchema.virtual("likesCount").get(function () {
  return this.likes.length;
});

// Método para incrementar vistas
projectSchema.methods.incrementViews = async function () {
  this.views += 1;
  await this.save({ validateBeforeSave: false });
};

// Método para toggle like
projectSchema.methods.toggleLike = async function (userId) {
  const index = this.likes.indexOf(userId);
  if (index > -1) {
    this.likes.splice(index, 1);
  } else {
    this.likes.push(userId);
  }
  await this.save({ validateBeforeSave: false });
  return this.likes.includes(userId);
};

// Método para actualizar última edición
projectSchema.methods.updateLastEdited = async function () {
  this.lastEdited = Date.now();
  await this.save({ validateBeforeSave: false });
};

// Pre-save middleware
projectSchema.pre("save", function (next) {
  if (
    this.isModified("htmlCode") ||
    this.isModified("cssCode") ||
    this.isModified("jsCode")
  ) {
    this.version += 1;
    this.lastEdited = Date.now();
  }
  next();
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
