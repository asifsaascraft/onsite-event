import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    // ==========================================
    // Basic Information
    // ==========================================
    fullName: {
      type: String,
      required: [true, "Full name is required."],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 150,
      index: true,
    },

    mobile: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid mobile number."],
    },

    // ==========================================
    // Authentication
    // ==========================================
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: 8,
      maxlength: 128,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
      required: true,
      immutable: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },

    profileImage: {
      type: String,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },

    // ==========================================
    // Password Reset
    // ==========================================
    passwordResetToken: {
      type: String,
      select: false,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Password Hashing
// ==========================================

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);

  if (!this.isNew) {
    this.passwordChangedAt = new Date();
  }
});

// ==========================================
// Compare Password
// ==========================================

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// ==========================================
// Check Password Changed After JWT
// ==========================================

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (!this.passwordChangedAt) {
    return false;
  }

  const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);

  return JWTTimestamp < changedTimestamp;
};

// ==========================================
// JSON Transform
// ==========================================

UserSchema.set("toJSON", {
  virtuals: true,

  transform(doc, ret) {
    ["password", "passwordResetToken", "passwordResetExpires", "__v"].forEach(
      (field) => delete ret[field],
    );

    return ret;
  },
});

// ==========================================
// Only ONE Admin
// ==========================================
//
// This creates a unique index for documents
// where role = admin.
//
// Since our User collection currently contains
// only admins, this guarantees one admin at DB level.
//

UserSchema.index(
  { role: 1 },
  {
    unique: true,
    partialFilterExpression: {
      role: "admin",
    },
  },
);

// ==========================================
// Export
// ==========================================

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
