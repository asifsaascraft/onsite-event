import {
  success200,
  created201,
  badRequest400,
  unauthorized401,
  forbidden403,
  notFound404,
  conflict409,
  validation422,
  internalServer500,
} from "./responses.js";

// ==========================================
// Authentication Swagger Paths
// ==========================================

const authPaths = {
  // ==========================================
  // Register Admin
  // ==========================================

  "/auth/register": {
    post: {
      tags: ["Authentication"],

      summary: "Register Admin",

      description:
        "Create the single admin account. This endpoint is intended for initial admin creation through Postman and should not be exposed in the admin frontend.",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            example: {
              fullName: "Admin",
              email: "admin@example.com",
              mobile: "9876543210",
              password: "Admin@123",
            },
          },
        },
      },

      responses: {
        201: created201,
        400: badRequest400,
        409: conflict409,
        422: validation422,
        500: internalServer500,
      },
    },
  },

  // ==========================================
  // Login
  // ==========================================

  "/auth/login": {
    post: {
      tags: ["Authentication"],

      summary: "Admin Login",

      description:
        "Login using admin email and password. A JWT access token is returned and a refresh token is stored in an HTTP-only cookie.",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            example: {
              email: "admin@example.com",
              password: "Admin@123",
            },
          },
        },
      },

      responses: {
        200: {
          description: "Login successful.",

          content: {
            "application/json": {
              example: {
                success: true,
                message: "Login successful.",
                data: {
                  user: {
                    _id: "6852b4d04ef5f2e4dbd0d001",
                    fullName: "Admin",
                    email: "admin@example.com",
                    mobile: "9876543210",
                    role: "admin",
                    status: "active",
                  },
                  accessToken: "eyJhbGciOiJIUzI1NiIs...",
                  tokenType: "Bearer",
                  expiresIn: "1d",
                },
              },
            },
          },
        },

        401: unauthorized401,

        403: forbidden403,

        422: validation422,

        500: internalServer500,
      },
    },
  },

  // ==========================================
  // Refresh Token
  // ==========================================

  "/auth/refresh": {
    post: {
      tags: ["Authentication"],

      summary: "Refresh Access Token",

      description:
        "Generate a new access token using the refresh token stored in the HTTP-only cookie.",

      responses: {
        200: {
          description: "Access token refreshed successfully.",

          content: {
            "application/json": {
              example: {
                success: true,
                message: "Access token refreshed successfully.",
                data: {
                  accessToken: "eyJhbGciOiJIUzI1NiIs...",
                  tokenType: "Bearer",
                  expiresIn: "1d",
                },
              },
            },
          },
        },

        401: unauthorized401,

        403: forbidden403,

        500: internalServer500,
      },
    },
  },

  // ==========================================
  // Logout
  // ==========================================

  "/auth/logout": {
    post: {
      tags: ["Authentication"],

      summary: "Admin Logout",

      description:
        "Logout the current admin session and clear the refresh token cookie.",

      responses: {
        200: {
          description: "Logout successful.",

          content: {
            "application/json": {
              example: {
                success: true,
                message: "Logout successful.",
                data: null,
              },
            },
          },
        },

        500: internalServer500,
      },
    },
  },

  // ==========================================
  // Get Current Admin
  // ==========================================

  "/auth/me": {
    get: {
      tags: ["Authentication"],

      summary: "Get Current Admin",

      description: "Get the currently authenticated admin profile.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: "Admin profile fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,
                message: "Admin profile fetched successfully.",
                data: {
                  _id: "6852b4d04ef5f2e4dbd0d001",
                  fullName: "Admin",
                  email: "admin@example.com",
                  mobile: "9876543210",
                  role: "admin",
                  status: "active",
                  lastLoginAt: "2026-08-24T10:00:00.000Z",
                  createdAt: "2026-08-24T09:00:00.000Z",
                  updatedAt: "2026-08-24T10:00:00.000Z",
                },
              },
            },
          },
        },

        401: unauthorized401,

        403: forbidden403,

        500: internalServer500,
      },
    },
  },

  // ==========================================
  // Update Admin Profile
  // ==========================================

  "/auth/profile": {
    patch: {
      tags: ["Authentication"],

      summary: "Update Admin Profile",

      description:
        "Update the authenticated admin profile including full name, mobile number and profile image.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: false,

        content: {
          "multipart/form-data": {
            schema: {
              type: "object",

              properties: {
                fullName: {
                  type: "string",
                  example: "Admin",
                },

                mobile: {
                  type: "string",
                  example: "9876543210",
                },

                profileImage: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: "Profile updated successfully.",

          content: {
            "application/json": {
              example: {
                success: true,
                message: "Profile updated successfully.",
                data: {
                  _id: "6852b4d04ef5f2e4dbd0d001",
                  fullName: "Admin",
                  email: "admin@example.com",
                  mobile: "9876543210",
                  profileImage:
                    "https://your-bucket.s3.amazonaws.com/profile-images/123456.jpg",
                  role: "admin",
                  status: "active",
                },
              },
            },
          },
        },

        401: unauthorized401,

        403: forbidden403,

        409: conflict409,

        422: validation422,

        500: internalServer500,
      },
    },
  },

  // ==========================================
  // Forgot Password
  // ==========================================

  "/auth/forgot-password": {
    post: {
      tags: ["Authentication"],

      summary: "Forgot Password",

      description: "Send a password reset link to the admin email address.",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            example: {
              email: "admin@example.com",
            },
          },
        },
      },

      responses: {
        200: {
          description: "Password reset request completed.",

          content: {
            "application/json": {
              example: {
                success: true,
                message:
                  "If the email is registered, a password reset link has been sent.",
                data: null,
              },
            },
          },
        },

        422: validation422,

        500: internalServer500,
      },
    },
  },

  // ==========================================
  // Reset Password
  // ==========================================

  "/auth/reset-password": {
    post: {
      tags: ["Authentication"],

      summary: "Reset Password",

      description: "Reset the admin password using the password reset token.",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            example: {
              token: "8e2a5c8f5d7c...",
              password: "NewPassword@123",
            },
          },
        },
      },

      responses: {
        200: {
          description: "Password reset successfully.",

          content: {
            "application/json": {
              example: {
                success: true,
                message: "Password reset successfully. Please login again.",
                data: null,
              },
            },
          },
        },

        400: badRequest400,

        422: validation422,

        500: internalServer500,
      },
    },
  },
};

export default authPaths;
