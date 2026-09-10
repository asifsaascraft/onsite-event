import mongoose from "mongoose";
import AppError from "../utils/appError.js";

const authorizeEvent = (
  req,
  res,
  next,
) => {
  const { eventId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(
      eventId,
    )
  ) {
    return next(
      new AppError(
        "Invalid event ID.",
        400,
      ),
    );
  }

  // ==========================================
  // Admin
  // ==========================================

  if (req.user?.role === "admin") {
    return next();
  }

  // ==========================================
  // Operator
  // ==========================================

  if (req.user?.role === "operator") {
    if (!req.user.eventId) {
      return next(
        new AppError(
          "Operator is not assigned to an event.",
          403,
        ),
      );
    }

    if (
      req.user.eventId.toString() !==
      eventId.toString()
    ) {
      return next(
        new AppError(
          "You are not authorized to access this event.",
          403,
        ),
      );
    }

    return next();
  }

  return next(
    new AppError(
      "You are not authorized to access this event.",
      403,
    ),
  );
};

export default authorizeEvent;