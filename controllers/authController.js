import jwt from "jsonwebtoken";

import User from "../models/User.js";
import UserSession from "../models/UserSession.js";

import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";

import { successResponse } from "../utils/response.js";

import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../utils/cookies.js";

import generateTokens from "../utils/generateTokens.js";
import generateRandomToken from "../utils/generateRandomToken.js";
import hashToken from "../utils/hashToken.js";
import sendEmail from "../utils/sendEmail.js";
import deleteS3Object from "../utils/deleteS3Object.js";
// ==========================================
// Register Admin
// ==========================================
//
// This endpoint is intended ONLY for the
// initial admin creation through Postman.
//
// It should NOT be exposed in the admin UI.
//
// ==========================================

export const registerAdmin = asyncHandler(async (req, res) => {
  const { fullName, email, mobile, password } = req.body;

  // ==========================================
  // Check Existing Admin
  // ==========================================

  const existingAdmin = await User.findOne({
    role: "admin",
  });

  if (existingAdmin) {
    throw new AppError(
      "Admin account already exists. Only one admin is allowed.",
      409,
    );
  }

  // ==========================================
  // Check Email
  // ==========================================

  const existingEmail = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingEmail) {
    throw new AppError("Email is already registered.", 409);
  }

  // ==========================================
  // Check Mobile
  // ==========================================

  if (mobile) {
    const existingMobile = await User.findOne({
      mobile,
    });

    if (existingMobile) {
      throw new AppError("Mobile number is already registered.", 409);
    }
  }

  // ==========================================
  // Create Admin
  // ==========================================

  const admin = await User.create({
    fullName,
    email,
    mobile,
    password,
    role: "admin",
    status: "active",
  });

  return successResponse(res, {
    statusCode: 201,
    message: "Admin account created successfully.",
    data: admin,
  });
});

// ==========================================
// Login
// ==========================================

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // ==========================================
  // Find User
  // ==========================================

  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  // ==========================================
  // Check Role
  // ==========================================

  if (user.role !== "admin") {
    throw new AppError("Invalid email or password.", 401);
  }

  // ==========================================
  // Check Status
  // ==========================================

  if (user.status !== "active") {
    throw new AppError("Your account is inactive.", 403);
  }

  // ==========================================
  // Check Password
  // ==========================================

  const isPasswordValid = await user.matchPassword(password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password.", 401);
  }

  // ==========================================
  // Create Temporary Session ID
  // ==========================================

  const sessionId = new UserSession({
    userId: user._id,
    refreshTokenHash: "temporary",
    userAgent: req.get("user-agent") || null,
    ipAddress: req.ip || null,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // ==========================================
  // Generate Tokens
  // ==========================================

  const { accessToken, refreshToken } = generateTokens({
    userId: user._id.toString(),
    role: user.role,
    sessionId: sessionId._id.toString(),
  });

  // ==========================================
  // Store Hashed Refresh Token
  // ==========================================

  sessionId.refreshTokenHash = hashToken(refreshToken);

  await sessionId.save();

  // ==========================================
  // Update Last Login
  // ==========================================

  user.lastLoginAt = new Date();

  await user.save();

  // ==========================================
  // Set Refresh Cookie
  // ==========================================

  setRefreshTokenCookie(res, refreshToken);

  // ==========================================
  // Response
  // ==========================================

  return successResponse(res, {
    statusCode: 200,
    message: "Login successful.",
    data: {
      user,
      accessToken,
      tokenType: "Bearer",
      expiresIn: process.env.JWT_EXPIRES || "1d",
    },
  });
});

// ==========================================
// Refresh Access Token
// ==========================================

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new AppError("Refresh token is required.", 401);
  }

  // ==========================================
  // Verify JWT
  // ==========================================

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    clearRefreshTokenCookie(res);

    throw new AppError("Invalid or expired refresh token.", 401);
  }

  if (decoded.tokenType !== "refresh") {
    clearRefreshTokenCookie(res);

    throw new AppError("Invalid refresh token.", 401);
  }

  // ==========================================
  // Find Session
  // ==========================================

  const session = await UserSession.findById(decoded.sessionId).select(
    "+refreshTokenHash",
  );

  if (!session) {
    clearRefreshTokenCookie(res);

    throw new AppError("Session not found.", 401);
  }

  // ==========================================
  // Check Revoked
  // ==========================================

  if (session.revokedAt) {
    clearRefreshTokenCookie(res);

    throw new AppError("Session has been revoked.", 401);
  }

  // ==========================================
  // Check Expiry
  // ==========================================

  if (session.expiresAt <= new Date()) {
    clearRefreshTokenCookie(res);

    throw new AppError("Session has expired.", 401);
  }

  // ==========================================
  // Compare Refresh Token
  // ==========================================

  const hashedToken = hashToken(token);

  if (hashedToken !== session.refreshTokenHash) {
    session.revokedAt = new Date();

    await session.save();

    clearRefreshTokenCookie(res);

    throw new AppError("Invalid refresh token.", 401);
  }

  // ==========================================
  // Find User
  // ==========================================

  const user = await User.findById(session.userId);

  if (!user) {
    clearRefreshTokenCookie(res);

    throw new AppError("User account no longer exists.", 401);
  }

  if (user.status !== "active") {
    clearRefreshTokenCookie(res);

    throw new AppError("Your account is inactive.", 403);
  }

  // ==========================================
  // Rotate Refresh Token
  // ==========================================

  const tokens = generateTokens({
    userId: user._id.toString(),
    role: user.role,
    sessionId: session._id.toString(),
  });

  session.refreshTokenHash = hashToken(tokens.refreshToken);

  session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await session.save();

  // ==========================================
  // Set New Cookie
  // ==========================================

  setRefreshTokenCookie(res, tokens.refreshToken);

  return successResponse(res, {
    message: "Access token refreshed successfully.",
    data: {
      accessToken: tokens.accessToken,
      tokenType: "Bearer",
      expiresIn: process.env.JWT_EXPIRES || "1d",
    },
  });
});

// ==========================================
// Logout
// ==========================================

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      if (decoded.sessionId) {
        await UserSession.findByIdAndUpdate(decoded.sessionId, {
          revokedAt: new Date(),
        });
      }
    } catch (error) {
      // Token already invalid/expired.
      // We still clear the cookie.
    }
  }

  clearRefreshTokenCookie(res);

  return successResponse(res, {
    message: "Logout successful.",
    data: null,
  });
});

// ==========================================
// Get Current Admin
// ==========================================

export const getMe = asyncHandler(async (req, res) => {
  return successResponse(res, {
    message: "Admin profile fetched successfully.",
    data: req.user,
  });
});

// ==========================================
// Update Admin Profile
// ==========================================

export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, mobile } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new AppError("User account no longer exists.", 404);
  }

  // ==========================================
  // Update Full Name
  // ==========================================

  if (fullName !== undefined) {
    user.fullName = fullName.trim();
  }

  // ==========================================
  // Update Mobile
  // ==========================================

  if (mobile !== undefined) {
    const existingMobile = await User.findOne({
      mobile,
      _id: {
        $ne: user._id,
      },
    });

    if (existingMobile) {
      throw new AppError("Mobile number is already registered.", 409);
    }

    user.mobile = mobile;
  }

  // ==========================================
  // Update Profile Image
  // ==========================================

  if (req.file) {
    const oldProfileImage = user.profileImage;

    user.profileImage = req.file.location;

    // Delete old image from S3
    if (oldProfileImage) {
      await deleteS3Object(oldProfileImage);
    }
  }

  // ==========================================
  // Save
  // ==========================================

  await user.save();

  // ==========================================
  // Response
  // ==========================================

  return successResponse(res, {
    message: "Profile updated successfully.",
    data: user,
  });
});

// ==========================================
// Forgot Password
// ==========================================

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+passwordResetToken +passwordResetExpires");

  // Do not reveal whether email
  // exists or not.
  if (!user) {
    return successResponse(res, {
      message:
        "If the email is registered, a password reset link has been sent.",
      data: null,
    });
  }

  const { rawToken, hashedToken } = generateRandomToken(32);

  user.passwordResetToken = hashedToken;

  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);

  await user.save();

  const frontendUrl = process.env.ADMIN_FRONTEND_URL;

  const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

  // ==========================================
  // Email
  // ==========================================

  if (process.env.ZEPTO_RESET_PASSWORD_TEMPLATE_KEY) {
    await sendEmail({
      to: user.email,
      name: user.fullName,
      subject: "Reset your admin password",
      templateKey: process.env.ZEPTO_RESET_PASSWORD_TEMPLATE_KEY,
      mergeInfo: {
        fullName: user.fullName,
        resetUrl,
      },
    });
  }

  return successResponse(res, {
    message: "Password reset link has been sent.",
    data: null,
  });
});

// ==========================================
// Reset Password
// ==========================================

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,

    passwordResetExpires: {
      $gt: new Date(),
    },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    throw new AppError("Invalid or expired password reset token.", 400);
  }

  user.password = password;

  user.passwordResetToken = null;

  user.passwordResetExpires = null;

  await user.save();

  // ==========================================
  // Revoke Existing Sessions
  // ==========================================

  await UserSession.updateMany(
    {
      userId: user._id,
      revokedAt: null,
    },
    {
      revokedAt: new Date(),
    },
  );

  clearRefreshTokenCookie(res);

  return successResponse(res, {
    message: "Password reset successfully. Please login again.",
    data: null,
  });
});
