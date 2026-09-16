const registrationScanPaths = {
  // ==========================================
  // Scan RegistrationData
  // ==========================================

  "/events/{eventId}/registration-data/scan/{categoryId}": {
    post: {
      tags: ["Registration Scan"],

      summary: "Scan Registration Data",

      description:
        "Scan a registration for a specific category using the registration number. The registration number is provided in the request body and the category ID is provided in the URL. The registration is scanned only when the category is active and the category is allowed for the registration data type. A registration can be scanned only once for the same category.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      // ==========================================
      // Parameters
      // ==========================================

      parameters: [
        {
          name: "eventId",
          in: "path",
          required: true,

          schema: {
            type: "string",
          },

          example: "6852b4d04ef5f2e4dbd0d003",
        },

        {
          name: "categoryId",
          in: "path",
          required: true,

          schema: {
            type: "string",
          },

          example: "6852b4d04ef5f2e4dbd0d050",
        },
      ],

      // ==========================================
      // Request Body
      // ==========================================

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ScanRegistrationRequest",
            },

            example: {
              regNum: "SPOT-001",
            },
          },
        },
      },

      // ==========================================
      // Responses
      // ==========================================

      responses: {
        // ==========================================
        // 201 - Successfully Scanned
        // ==========================================

        201: {
          description: "Registration scanned successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Registration scanned successfully.",

                data: {
                  scan: {
                    _id: "6852b4d04ef5f2e4dbd0d060",

                    eventId: {
                      _id: "6852b4d04ef5f2e4dbd0d003",

                      eventName: "Hyderabad Convention",

                      eventShortName: "HYD-CON",
                    },

                    registrationDataId: {
                      _id: "6852b4d04ef5f2e4dbd0d030",

                      regNum: "SPOT-001",

                      name: "John Doe",

                      email: "john@example.com",

                      mobile: "9876543210",
                    },

                    categoryId: {
                      _id: "6852b4d04ef5f2e4dbd0d050",

                      categoryCode: "KIT",

                      categoryName: "Kitbag",

                      status: "active",

                      groupCategoryId: "6852b4d04ef5f2e4dbd0d040",
                    },

                    isScanned: true,

                    scannedAt: "2026-09-16T08:30:00.000Z",

                    createdAt: "2026-09-16T08:30:00.000Z",

                    updatedAt: "2026-09-16T08:30:00.000Z",
                  },

                  registration: {
                    _id: "6852b4d04ef5f2e4dbd0d030",

                    regNum: "SPOT-001",

                    name: "John Doe",
                  },

                  regDataType: {
                    _id: "6852b4d04ef5f2e4dbd0d010",

                    regDataTypeName: "Delegate",
                  },

                  category: {
                    _id: "6852b4d04ef5f2e4dbd0d050",

                    categoryCode: "KIT",

                    categoryName: "Kitbag",

                    status: "active",

                    groupCategoryId: "6852b4d04ef5f2e4dbd0d040",
                  },

                  isAllowed: true,

                  isScanned: true,

                  scannedAt: "2026-09-16T08:30:00.000Z",
                },
              },
            },
          },
        },

        // ==========================================
        // 409 - Already Scanned
        // ==========================================

        409: {
          description:
            "Registration has already been scanned for this category.",

          content: {
            "application/json": {
              example: {
                success: false,

                message:
                  "Registration has already been scanned for this category.",
              },
            },
          },
        },

        // ==========================================
        // 400 - Bad Request
        // ==========================================

        400: {
          description: "Invalid event ID or category ID.",
        },

        // ==========================================
        // 401 - Unauthorized
        // ==========================================

        401: {
          description: "Authentication required or invalid access token.",
        },

        // ==========================================
        // 403 - Forbidden
        // ==========================================

        403: {
          description:
            "Category is inactive, category is not allowed for the registration data type, or user is not authorized for this event.",
        },

        // ==========================================
        // 404 - Not Found
        // ==========================================

        404: {
          description:
            "Event, registration data, category, or RegDataType not found.",
        },

        // ==========================================
        // 500 - Internal Server Error
        // ==========================================

        500: {
          description: "Internal server error.",
        },
      },
    },
  },

  // ==========================================
  // Registration Scan Summary
  // ==========================================

  "/events/{eventId}/registration-scan/summary": {
    get: {
      tags: ["Registration Scan"],

      summary: "Get Registration Scan Summary",

      description:
        "Get registration scan summary grouped by group category. The summary shows the total eligible registrations, scanned registrations, and scanning coverage percentage for each category.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      // ==========================================
      // Parameters
      // ==========================================

      parameters: [
        {
          name: "eventId",
          in: "path",
          required: true,

          schema: {
            type: "string",
          },

          example: "6852b4d04ef5f2e4dbd0d003",
        },
      ],

      // ==========================================
      // Responses
      // ==========================================

      responses: {
        // ==========================================
        // 200 - Success
        // ==========================================

        200: {
          description: "Registration scan summary fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Registration scan summary fetched successfully.",

                data: [
                  {
                    groupCategory: {
                      _id: "6852b4d04ef5f2e4dbd0d040",

                      groupCategoryName: "Food Scan",
                    },

                    categories: [
                      {
                        categoryId: "6852b4d04ef5f2e4dbd0d050",

                        categoryName: "Breakfast - 13/09/2026",

                        scanned: 79,

                        total: 120,

                        coverage: 66,
                      },

                      {
                        categoryId: "6852b4d04ef5f2e4dbd0d051",

                        categoryName: "DINNER - 12/09/2026",

                        scanned: 293,

                        total: 340,

                        coverage: 86,
                      },

                      {
                        categoryId: "6852b4d04ef5f2e4dbd0d052",

                        categoryName: "FACULTY LUNCH - 12/09/2026",

                        scanned: 18,

                        total: 45,

                        coverage: 40,
                      },
                    ],
                  },

                  {
                    groupCategory: {
                      _id: "6852b4d04ef5f2e4dbd0d060",

                      groupCategoryName: "Gift",
                    },

                    categories: [
                      {
                        categoryId: "6852b4d04ef5f2e4dbd0d061",

                        categoryName: "KIT",

                        scanned: 462,

                        total: 600,

                        coverage: 77,
                      },
                    ],
                  },

                  {
                    groupCategory: {
                      _id: "6852b4d04ef5f2e4dbd0d070",

                      groupCategoryName: "Certificate",
                    },

                    categories: [
                      {
                        categoryId: "6852b4d04ef5f2e4dbd0d071",

                        categoryName: "Certificate",

                        scanned: 380,

                        total: 500,

                        coverage: 76,
                      },
                    ],
                  },
                ],
              },
            },
          },
        },

        // ==========================================
        // 400 - Bad Request
        // ==========================================

        400: {
          description: "Invalid event ID.",
        },

        // ==========================================
        // 401 - Unauthorized
        // ==========================================

        401: {
          description: "Authentication required or invalid access token.",
        },

        // ==========================================
        // 403 - Forbidden
        // ==========================================

        403: {
          description: "User is not authorized for this event.",
        },

        // ==========================================
        // 404 - Not Found
        // ==========================================

        404: {
          description: "Event not found.",
        },

        // ==========================================
        // 500 - Internal Server Error
        // ==========================================

        500: {
          description: "Internal server error.",
        },
      },
    },
  },
};

export default registrationScanPaths;
