import {
  successExample,
  errorExample,
} from "./examples.js";

// ==========================================
// 200
// ==========================================

export const success200 = {
  description:
    "Request completed successfully.",

  content: {
    "application/json": {
      example: successExample,
    },
  },
};

// ==========================================
// 201
// ==========================================

export const created201 = {
  description:
    "Resource created successfully.",

  content: {
    "application/json": {
      example: {
        success: true,
        message:
          "Resource created successfully.",
        data: null,
      },
    },
  },
};

// ==========================================
// 400
// ==========================================

export const badRequest400 = {
  description: "Bad Request.",

  content: {
    "application/json": {
      example: {
        success: false,
        message: "Bad Request.",
        errors: null,
        data: null,
      },
    },
  },
};

// ==========================================
// 401
// ==========================================

export const unauthorized401 = {
  description: "Unauthorized.",

  content: {
    "application/json": {
      example: {
        success: false,
        message: "Unauthorized.",
        errors: null,
        data: null,
      },
    },
  },
};

// ==========================================
// 403
// ==========================================

export const forbidden403 = {
  description: "Forbidden.",

  content: {
    "application/json": {
      example: {
        success: false,
        message: "Forbidden.",
        errors: null,
        data: null,
      },
    },
  },
};

// ==========================================
// 404
// ==========================================

export const notFound404 = {
  description: "Resource not found.",

  content: {
    "application/json": {
      example: {
        success: false,
        message: "Resource not found.",
        errors: null,
        data: null,
      },
    },
  },
};

// ==========================================
// 409
// ==========================================

export const conflict409 = {
  description: "Conflict.",

  content: {
    "application/json": {
      example: {
        success: false,
        message:
          "Resource already exists.",
        errors: null,
        data: null,
      },
    },
  },
};

// ==========================================
// 422
// ==========================================

export const validation422 = {
  description: "Validation failed.",

  content: {
    "application/json": {
      example: {
        success: false,
        message: "Validation failed.",
        errors: null,
        data: null,
      },
    },
  },
};

// ==========================================
// 500
// ==========================================

export const internalServer500 = {
  description:
    "Internal server error.",

  content: {
    "application/json": {
      example: errorExample,
    },
  },
};