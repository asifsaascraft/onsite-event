import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    // ==========================================
    // Event Information
    // ==========================================

    eventName: {
      type: String,
      required: [true, "Event name is required."],
      trim: true,
      maxlength: 200,
    },

    eventShortName: {
      type: String,
      required: [true, "Event short name is required."],
      trim: true,
      unique: true,
      maxlength: 30,
    },

    // Unique code used by operator to login
    operatorLoginCode: {
      type: String,
      required: [true, "Operator login code is required."],
      trim: true,
      unique: true,
      maxlength: 30,
    },

    // ==========================================
    // Organizer
    // ==========================================

    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
      required: [true, "Organizer is required."],
      index: true,
    },

    // ==========================================
    // Venue
    // ==========================================

    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: [true, "Venue is required."],
      index: true,
    },

    // ==========================================
    // Event Dates
    // ==========================================

    startDate: {
      type: Date,
      required: [true, "Start date is required."],
    },

    endDate: {
      type: Date,
      required: [true, "End date is required."],
      validate: {
        validator: function (value) {
          if (!this.startDate || !value) {
            return true;
          }

          return value >= this.startDate;
        },

        message:
          "End date must be greater than or equal to start date.",
      },
    },

    // ==========================================
    // Event Logo
    // ==========================================

    uploadEventLogo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Indexes
// ==========================================

EventSchema.index({
  createdAt: -1,
});

// ==========================================
// Dynamic Event Status
// ==========================================

EventSchema.virtual("dynamicStatus").get(function () {
  if (!this.startDate || !this.endDate) {
    return null;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const startDate = new Date(this.startDate);

  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(this.endDate);

  endDate.setHours(23, 59, 59, 999);

  if (today < startDate) {
    return "Upcoming";
  }

  if (today > endDate) {
    return "Past";
  }

  return "Live";
});

// ==========================================
// JSON Transform
// ==========================================

EventSchema.set("toJSON", {
  virtuals: true,

  transform(doc, ret) {
    delete ret.__v;

    return ret;
  },
});

// ==========================================
// Object Transform
// ==========================================

EventSchema.set("toObject", {
  virtuals: true,
});

// ==========================================
// Export
// ==========================================

const Event =
  mongoose.models.Event ||
  mongoose.model("Event", EventSchema);

export default Event;