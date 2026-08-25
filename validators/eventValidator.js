import { body } from "express-validator";

// ==========================================
// Create Event
// ==========================================

export const createEventValidator = [
  body("eventName")
    .trim()
    .notEmpty()
    .withMessage("Event name is required.")
    .isLength({
      max: 200,
    })
    .withMessage(
      "Event name cannot exceed 200 characters.",
    ),

  body("eventShortName")
    .trim()
    .notEmpty()
    .withMessage(
      "Event short name is required.",
    )
    .isLength({
      max: 30,
    })
    .withMessage(
      "Event short name cannot exceed 30 characters.",
    ),

  body("operatorLoginCode")
    .trim()
    .notEmpty()
    .withMessage(
      "Operator login code is required.",
    )
    .isLength({
      max: 30,
    })
    .withMessage(
      "Operator login code cannot exceed 30 characters.",
    ),

  body("organizerId")
    .trim()
    .notEmpty()
    .withMessage(
      "Organizer is required.",
    )
    .isMongoId()
    .withMessage(
      "Invalid organizer ID.",
    ),

  body("venueId")
    .trim()
    .notEmpty()
    .withMessage(
      "Venue is required.",
    )
    .isMongoId()
    .withMessage(
      "Invalid venue ID.",
    ),

  body("startDate")
    .notEmpty()
    .withMessage(
      "Start date is required.",
    )
    .isISO8601()
    .withMessage(
      "Please provide a valid start date.",
    ),

  body("endDate")
    .notEmpty()
    .withMessage(
      "End date is required.",
    )
    .isISO8601()
    .withMessage(
      "Please provide a valid end date.",
    ),
];

// ==========================================
// Update Event
// ==========================================

export const updateEventValidator = [
  body("eventName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      "Event name cannot be empty.",
    )
    .isLength({
      max: 200,
    })
    .withMessage(
      "Event name cannot exceed 200 characters.",
    ),

  body("eventShortName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      "Event short name cannot be empty.",
    )
    .isLength({
      max: 30,
    })
    .withMessage(
      "Event short name cannot exceed 30 characters.",
    ),

  body("operatorLoginCode")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      "Operator login code cannot be empty.",
    )
    .isLength({
      max: 30,
    })
    .withMessage(
      "Operator login code cannot exceed 30 characters.",
    ),

  body("organizerId")
    .optional()
    .trim()
    .isMongoId()
    .withMessage(
      "Invalid organizer ID.",
    ),

  body("venueId")
    .optional()
    .trim()
    .isMongoId()
    .withMessage(
      "Invalid venue ID.",
    ),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage(
      "Please provide a valid start date.",
    ),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage(
      "Please provide a valid end date.",
    ),
];