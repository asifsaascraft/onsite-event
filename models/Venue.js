import mongoose from "mongoose";

const VenueSchema = new mongoose.Schema(
  {
    // Venue Information
    venueName: {
      type: String,
      required: [true, "Venue name is required."],
      trim: true,
      unique: true,
      maxlength: 250,
    },
    country: {
      type: String,
      required: [true, "Country is required."],
      trim: true,
      maxlength: 100,
    },
    state: {
      type: String,
      required: [true, "State is required."],
      trim: true,
      maxlength: 100,
    },
    city: {
      type: String,
      required: [true, "City is required."],
      trim: true,
      maxlength: 100,
    },
    address: {
      type: String,
      required: [true, "Address is required."],
      trim: true,
      maxlength: 500,
    },
    website: {
      type: String,
      required: [true, "Website link is required."],
      trim: true,
      maxlength: 255,
    },
    mapLink: {
      type: String,
      required: [true, "Map link is required."],
      trim: true,
    },
    uploadVenuePhoto: {
      type: String,
      required: [true, "Photo is required."],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
VenueSchema.index({
  createdAt: -1,
});

// JSON Transform
VenueSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export
const Venue = mongoose.models.Venue || mongoose.model("Venue", VenueSchema);

export default Venue;
