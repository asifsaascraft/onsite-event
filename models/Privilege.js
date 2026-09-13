import mongoose from "mongoose";

const PrivilegeSchema = new mongoose.Schema(
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
    // Registration Data Type
    // ==========================================

    regDataTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegDataType",
      required: [
        true,
        "Reg data type is required.",
      ],
      index: true,
    },

    // ==========================================
    // Category
    // ==========================================

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required."],
      index: true,
    },

    // ==========================================
    // Permission
    // ==========================================

    isAllowed: {
      type: Boolean,
      required: [true, "Permission is required."],
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Indexes
// ==========================================

// One privilege per RegDataType + Category
// combination inside an event.
PrivilegeSchema.index(
  {
    eventId: 1,
    regDataTypeId: 1,
    categoryId: 1,
  },
  {
    unique: true,
  },
);

PrivilegeSchema.index({
  createdAt: -1,
});

// ==========================================
// JSON Transform
// ==========================================

PrivilegeSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;

    return ret;
  },
});

// ==========================================
// Export
// ==========================================

const Privilege =
  mongoose.models.Privilege ||
  mongoose.model("Privilege", PrivilegeSchema);

export default Privilege;