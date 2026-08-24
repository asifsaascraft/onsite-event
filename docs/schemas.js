export const schemas = {
  User: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example:
          "6852b4d04ef5f2e4dbd0d001",
      },

      fullName: {
        type: "string",
        example: "Admin",
      },

      email: {
        type: "string",
        format: "email",
        example:
          "admin@example.com",
      },

      mobile: {
        type: "string",
        example: "9876543210",
      },

      role: {
        type: "string",
        example: "admin",
        enum: ["admin"],
      },

      status: {
        type: "string",
        example: "active",
        enum: [
          "active",
          "inactive",
        ],
      },

      lastLoginAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },

      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
  },

  LoginRequest: {
    type: "object",

    required: [
      "email",
      "password",
    ],

    properties: {
      email: {
        type: "string",
        format: "email",
        example:
          "admin@example.com",
      },

      password: {
        type: "string",
        format: "password",
        example:
          "Admin@123",
      },
    },
  },

  TokenResponse: {
    type: "object",

    properties: {
      accessToken: {
        type: "string",
        example:
          "eyJhbGciOiJIUzI1NiIs...",
      },

      tokenType: {
        type: "string",
        example: "Bearer",
      },

      expiresIn: {
        type: "string",
        example: "15m",
      },
    },
  },
};

export default schemas;