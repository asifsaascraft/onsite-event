export const schemas = {
  // ==========================================
  // User
  // ==========================================

  User: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "6852b4d04ef5f2e4dbd0d001",
      },

      fullName: {
        type: "string",
        example: "Admin",
      },

      email: {
        type: "string",
        format: "email",
        example: "admin@example.com",
      },

      mobile: {
        type: "string",
        example: "9876543210",
        nullable: true,
      },

      role: {
        type: "string",
        enum: ["admin"],
        example: "admin",
      },

      status: {
        type: "string",
        enum: ["active", "inactive"],
        example: "active",
      },

      profileImage: {
        type: "string",
        nullable: true,
        example:
          "https://your-bucket.s3.amazonaws.com/profile-images/admin.jpg",
      },

      lastLoginAt: {
        type: "string",
        format: "date-time",
        nullable: true,
        example: "2026-08-25T10:00:00.000Z",
      },

      createdAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-25T09:00:00.000Z",
      },

      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-25T10:00:00.000Z",
      },
    },
  },

  // ==========================================
  // Register Admin Request
  // ==========================================

  RegisterAdminRequest: {
    type: "object",

    required: [
      "fullName",
      "email",
      "password",
    ],

    properties: {
      fullName: {
        type: "string",
        example: "Admin",
      },

      email: {
        type: "string",
        format: "email",
        example: "admin@example.com",
      },

      mobile: {
        type: "string",
        example: "9876543210",
      },

      password: {
        type: "string",
        format: "password",
        example: "Admin@123",
      },
    },
  },

  // ==========================================
  // Login Request
  // ==========================================

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
        example: "admin@example.com",
      },

      password: {
        type: "string",
        format: "password",
        example: "Admin@123",
      },
    },
  },

  // ==========================================
  // Token Response
  // ==========================================

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
        example: "1d",
      },
    },
  },

  // ==========================================
  // Forgot Password Request
  // ==========================================

  ForgotPasswordRequest: {
    type: "object",

    required: ["email"],

    properties: {
      email: {
        type: "string",
        format: "email",
        example: "admin@example.com",
      },
    },
  },

  // ==========================================
  // Reset Password Request
  // ==========================================

  ResetPasswordRequest: {
    type: "object",

    required: [
      "token",
      "password",
    ],

    properties: {
      token: {
        type: "string",
        example:
          "8e2a5c8f5d7c1234567890abcdef",
      },

      password: {
        type: "string",
        format: "password",
        example: "NewPassword@123",
      },
    },
  },

  // ==========================================
  // Venue
  // ==========================================

  Venue: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "6852b4d04ef5f2e4dbd0d002",
      },

      venueName: {
        type: "string",
        example: "India Expo Mart",
      },

      country: {
        type: "string",
        example: "India",
      },

      state: {
        type: "string",
        example: "Uttar Pradesh",
      },

      city: {
        type: "string",
        example: "Greater Noida",
      },

      address: {
        type: "string",
        example:
          "Knowledge Park II, Greater Noida, Uttar Pradesh",
      },

      website: {
        type: "string",
        example:
          "https://www.example.com",
      },

      mapLink: {
        type: "string",
        example:
          "https://maps.google.com/example",
      },

      uploadVenuePhoto: {
        type: "string",
        example:
          "https://your-bucket.s3.amazonaws.com/venue-photos/venue.jpg",
      },

      createdAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-25T09:00:00.000Z",
      },

      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-25T09:00:00.000Z",
      },
    },
  },

  // ==========================================
  // Organizer
  // ==========================================

  Organizer: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "6852b4d04ef5f2e4dbd0d003",
      },

      organizerName: {
        type: "string",
        example: "ABC Events Pvt Ltd",
      },

      contactPersonName: {
        type: "string",
        example: "John Doe",
      },

      contactPersonEmail: {
        type: "string",
        format: "email",
        example: "john@example.com",
      },

      contactPersonMobile: {
        type: "string",
        example: "9876543210",
        nullable: true,
      },

      createdAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-25T09:00:00.000Z",
      },

      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-25T09:00:00.000Z",
      },
    },
  },

  // ==========================================
  // Event
  // ==========================================

  Event: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "6852b4d04ef5f2e4dbd0d004",
      },

      eventName: {
        type: "string",
        example: "International Expo 2026",
      },

      eventShortName: {
        type: "string",
        example: "EXPO2026",
      },

      operatorLoginCode: {
        type: "string",
        example: "EXPO2026-OP01",
      },

      organizerId: {
        type: "string",
        example: "6852b4d04ef5f2e4dbd0d003",
      },

      venueId: {
        type: "string",
        example: "6852b4d04ef5f2e4dbd0d002",
      },

      startDate: {
        type: "string",
        format: "date-time",
        example: "2026-09-10T00:00:00.000Z",
      },

      endDate: {
        type: "string",
        format: "date-time",
        example: "2026-09-12T23:59:59.000Z",
      },

      uploadEventLogo: {
        type: "string",
        nullable: true,
        example:
          "https://your-bucket.s3.amazonaws.com/event-logos/event-logo.png",
      },

      dynamicStatus: {
        type: "string",
        enum: [
          "Upcoming",
          "Live",
          "Past",
        ],
        nullable: true,
        example: "Upcoming",
      },

      createdAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-25T09:00:00.000Z",
      },

      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-25T09:00:00.000Z",
      },
    },
  },
};

export default schemas;