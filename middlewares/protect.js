import jwt from "jsonwebtoken";

import User from "../models/User.js";
import UserSession from "../models/UserSession.js";

import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";

const protect = asyncHandler(
  async (req, res, next) => {
    // ==========================================
    // Get Authorization Header
    // ==========================================

    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      throw new AppError(
        "Authentication required.",
        401,
      );
    }

    const token =
      authHeader.substring(7).trim();

    if (!token) {
      throw new AppError(
        "Authentication required.",
        401,
      );
    }

    // ==========================================
    // Verify Access Token
    // ==========================================

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET,
      );
    } catch (error) {
      if (
        error.name ===
        "TokenExpiredError"
      ) {
        throw new AppError(
          "Access token has expired.",
          401,
        );
      }

      throw new AppError(
        "Invalid access token.",
        401,
      );
    }

    // ==========================================
    // Validate Token Type
    // ==========================================

    if (
      decoded.tokenType !== "access"
    ) {
      throw new AppError(
        "Invalid access token.",
        401,
      );
    }

    // ==========================================
    // Validate User ID
    // ==========================================

    if (!decoded.userId) {
      throw new AppError(
        "Invalid access token.",
        401,
      );
    }

    // ==========================================
    // Find User
    // ==========================================

    const user =
      await User.findById(
        decoded.userId,
      );

    if (!user) {
      throw new AppError(
        "User account no longer exists.",
        401,
      );
    }

    // ==========================================
    // Account Status
    // ==========================================

    if (
      user.status !== "active"
    ) {
      throw new AppError(
        "Your account is inactive.",
        403,
      );
    }

    // ==========================================
    // Check Password Changed
    // ==========================================

    if (
      user.changedPasswordAfter(
        decoded.iat,
      )
    ) {
      throw new AppError(
        "Password was changed. Please login again.",
        401,
      );
    }

    // ==========================================
    // Check Session
    // ==========================================

    if (decoded.sessionId) {
      const session =
        await UserSession.findById(
          decoded.sessionId,
        );

      if (!session) {
        throw new AppError(
          "Session is no longer valid.",
          401,
        );
      }

      // Make sure session belongs
      // to this user.

      if (
        session.userId.toString() !==
        user._id.toString()
      ) {
        throw new AppError(
          "Invalid authentication session.",
          401,
        );
      }

      // ==========================================
      // Check Revoked
      // ==========================================

      if (session.revokedAt) {
        throw new AppError(
          "Session has been revoked.",
          401,
        );
      }

      // ==========================================
      // Check Expiry
      // ==========================================

      if (
        session.expiresAt <=
        new Date()
      ) {
        throw new AppError(
          "Session has expired.",
          401,
        );
      }
    }

    // ==========================================
    // Attach User
    // ==========================================

    req.user = user;

    req.auth = {
      userId: user._id,
      role: user.role,
      sessionId:
        decoded.sessionId || null,
    };

    next();
  },
);

export default protect;