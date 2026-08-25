import mongoose from "mongoose";

const OrganizerSchema = new mongoose.Schema(
  {
    // Organizer Information
    organizerName: {
      type: String,
      required: [true, "Organizer name is required."],
      trim: true,
      unique: true,
      maxlength: 250,
    },
    contactPersonName: {
      type: String,
      required: [true, "Contact person name is required."],
      trim: true,
      maxlength: 250,
    },
    contactPersonEmail: {
      type: String,
      required: [true, "Contact person email is required."],
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 150,
      index: true,
    },

    contactPersonMobile: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid mobile number."],
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
OrganizerSchema.index({
  createdAt: -1,
});

// JSON Transform
OrganizerSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export
const Organizer = mongoose.models.Organizer || mongoose.model("Organizer", OrganizerSchema);

export default Organizer;
