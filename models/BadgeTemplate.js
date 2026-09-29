
import mongoose from "mongoose";

const BadgeFieldSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },       // "name", "regNum", "qr", "email", ...
    label: { type: String, required: true },     // "Full Name"
    enabled: { type: Boolean, default: true },
    order: { type: Number, required: true },
    fontSize: { type: Number, default: 20 },     // in px, rendered at print scale
    fontWeight: {
      type: String,
      enum: ["normal", "bold"],
      default: "normal",
    },
    align: {
      type: String,
      enum: ["left", "center", "right"],
      default: "center",
    },
  },
  { _id: false },
);

const BadgeTemplateSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      unique: true,
      index: true,
    },
    fields: { type: [BadgeFieldSchema], default: [] },
    qrSize: { type: Number, default: 80 },        // px
    badgeWidthIn: { type: Number, default: 4 },   // inches
    badgeHeightIn: { type: Number, default: 3 },  // inches
  },
  { timestamps: true },
);

export default mongoose.model("BadgeTemplate", BadgeTemplateSchema);