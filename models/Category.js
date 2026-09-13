import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    // ==========================================
    // Event
    // ==========================================

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event is required."],
      index: true,
    },

    // ==========================================
    // Category Information
    // ==========================================
    categoryCode: {
      type: String,
      required: [true, "Category code is required."],
      trim: true,
      maxlength: 50,
    },

    categoryName: {
      type: String,
      required: [true, "Category name is required."],
      trim: true,
      maxlength: 250,
    },

    groupCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroupCategory",
      required: [true, "Group category is required."],
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      required: [true, "Status is required."],
      default: "active",
    },

    // ==========================================
    // optional Information
    // ==========================================
    day: {
      type: String,
      trim: true,
    },

    hall: {
      type: String,
      trim: true,
    },

    session: {
      type: String,
      trim: true,
    },

    time: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Indexes
// ==========================================

// Same Category code can exist in different events,
// but cannot be duplicated inside the same event.
CategorySchema.index(
  {
    eventId: 1,
    categoryCode: 1,
  },
  {
    unique: true,
  },
);

// Same Category name can exist in different events,
// but cannot be duplicated inside the same event.
CategorySchema.index(
  {
    eventId: 1,
    categoryName: 1,
  },
  {
    unique: true,
  },
);

CategorySchema.index({
  createdAt: -1,
});

// ==========================================
// JSON Transform
// ==========================================
CategorySchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// ==========================================
// Export
// ==========================================
const Category =
  mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);

export default Category;