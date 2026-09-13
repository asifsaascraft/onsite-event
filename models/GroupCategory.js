import mongoose from "mongoose";

const GroupCategorySchema = new mongoose.Schema(
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
    // GroupCategory Information
    // ==========================================
    groupCategoryName: {
      type: String,
      required: [true, "Group category name is required."],
      trim: true,
      maxlength: 250,
    },

    description: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Indexes
// ==========================================

// Same GroupCategory name can exist in different events,
// but cannot be duplicated inside the same event.
GroupCategorySchema.index(
  {
    eventId: 1,
    groupCategoryName: 1,
  },
  {
    unique: true,
  },
);

GroupCategorySchema.index({
  createdAt: -1,
});

// ==========================================
// JSON Transform
// ==========================================
GroupCategorySchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// ==========================================
// Export
// ==========================================
const GroupCategory =
  mongoose.models.GroupCategory ||
  mongoose.model("GroupCategory", GroupCategorySchema);

export default GroupCategory;