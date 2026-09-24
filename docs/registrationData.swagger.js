import {
  created201,
  badRequest400,
  unauthorized401,
  forbidden403,
  notFound404,
  conflict409,
  validation422,
  internalServer500,
} from "./responses.js";

const registrationDataPaths = {
  // ==========================================
  // Create RegistrationData
  // ==========================================

  "/events/{eventId}/registration-data": {
    post: {
      tags: ["Registration Data"],

      summary: "Create Registration Data",

      description:
        "Create registration data for a specific event. Registration number is generated automatically by the backend.",

      security: [
        {
          bearerAuth: [],
        },
      ],

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

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RegistrationDataRequest",
            },

            example: {
              regDataTypeId: "6852b4d04ef5f2e4dbd0d010",

              name: "John Doe",

              email: "john@example.com",

              mobile: "9876543210",

              mciNumber: "MCI123456",

              address: "123 Main Street",

              city: "Hyderabad",

              state: "Telangana",

              country: "India",

              reference: "Friend",

              note: "Special note",
            },
          },
        },
      },

      responses: {
        201: {
          description: "Registration data created successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Registration data created successfully.",

                data: {
                  _id: "6852b4d04ef5f2e4dbd0d030",

                  eventId: {
                    _id: "6852b4d04ef5f2e4dbd0d003",

                    eventName: "National Convention 2026",

                    eventShortName: "NC2026",
                  },

                  regDataTypeId: {
                    _id: "6852b4d04ef5f2e4dbd0d010",

                    regDataTypeName: "Spot",
                  },

                  name: "John Doe",

                  regNum: "SPOT-001",

                  email: "john@example.com",

                  mobile: "9876543210",

                  mciNumber: "MCI123456",

                  address: "123 Main Street",

                  city: "Hyderabad",

                  state: "Telangana",

                  country: "India",

                  reference: "Friend",

                  note: "Special note",

                  isPrinted: false,

                  printedAt: null,

                  createdAt: "2026-09-15T10:00:00.000Z",

                  updatedAt: "2026-09-15T10:00:00.000Z",
                },
              },
            },
          },
        },

        400: badRequest400,
        401: unauthorized401,
        403: forbidden403,
        404: notFound404,
        409: conflict409,
        422: validation422,
        500: internalServer500,
      },
    },

    // ==========================================
    // Get All RegistrationData
    // ==========================================

    get: {
      tags: ["Registration Data"],

      summary: "Get Event Registration Data",

      description: "Get all registration data belonging to a specific event.",

      security: [
        {
          bearerAuth: [],
        },
      ],

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
          name: "page",
          in: "query",

          schema: {
            type: "integer",
            example: 1,
          },
        },

        {
          name: "limit",
          in: "query",

          schema: {
            type: "integer",
            example: 20,
          },
        },

        {
          name: "search",
          in: "query",

          schema: {
            type: "string",
            example: "John",
          },
        },

        {
          name: "sortBy",
          in: "query",

          schema: {
            type: "string",

            enum: ["regNum", "name", "createdAt"],

            example: "createdAt",
          },
        },

        {
          name: "order",
          in: "query",

          schema: {
            type: "string",

            enum: ["asc", "desc"],

            example: "desc",
          },
        },
      ],

      responses: {
        200: {
          description: "Registration data fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Registration data fetched successfully.",

                data: [
                  {
                    _id: "6852b4d04ef5f2e4dbd0d030",

                    eventId: {
                      _id: "6852b4d04ef5f2e4dbd0d003",

                      eventName: "National Convention 2026",

                      eventShortName: "NC2026",
                    },

                    regDataTypeId: {
                      _id: "6852b4d04ef5f2e4dbd0d010",

                      regDataTypeName: "Spot",
                    },

                    name: "John Doe",

                    regNum: "SPOT-001",

                    email: "john@example.com",

                    mobile: "9876543210",

                    city: "Hyderabad",

                    state: "Telangana",

                    country: "India",

                    reference: "Friend",

                    note: "Special note",

                    isPrinted: false,

                    printedAt: null,

                    createdAt: "2026-09-15T10:00:00.000Z",

                    updatedAt: "2026-09-15T10:00:00.000Z",
                  },
                ],

                pagination: {
                  page: 1,
                  limit: 20,
                  total: 1,
                  totalPages: 1,
                  from: 1,
                  to: 1,
                  hasPreviousPage: false,
                  hasNextPage: false,
                },
              },
            },
          },
        },

        400: badRequest400,
        401: unauthorized401,
        403: forbidden403,
        404: notFound404,
        500: internalServer500,
      },
    },

    // ==========================================
    // Delete All RegistrationData
    // ==========================================

    delete: {
      tags: ["Registration Data"],

      summary: "Delete All Registration Data (Danger Zone)",

      description:
        "Delete all registration data belonging to a specific event.",

      security: [
        {
          bearerAuth: [],
        },
      ],

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

      responses: {
        200: {
          description: "All registration data deleted successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "All registration data deleted successfully.",

                data: {
                  deletedCount: 100,
                },
              },
            },
          },
        },

        400: badRequest400,
        401: unauthorized401,
        403: forbidden403,
        404: notFound404,
        500: internalServer500,
      },
    },
  },

  // ==========================================
  // RegistrationData Summary
  // ==========================================

  "/events/{eventId}/registration-data/summary": {
    get: {
      tags: ["Registration Data"],

      summary: "Get Registration Data Summary",

      description:
        "Get registration data summary for a specific event, including total, printed, and not printed registration data.",

      security: [
        {
          bearerAuth: [],
        },
      ],

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

      responses: {
        200: {
          description: "Registration data summary fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Registration data summary fetched successfully.",

                data: {
                  total: 100,
                  printed: 65,
                  notPrinted: 35,
                },
              },
            },
          },
        },

        400: badRequest400,
        401: unauthorized401,
        403: forbidden403,
        404: notFound404,
        500: internalServer500,
      },
    },
  },

  // ==========================================
  // Get All Printed RegistrationData
  // ==========================================

  "/events/{eventId}/registration-data/printed": {
    get: {
      tags: ["Registration Data"],

      summary: "Get All Printed Registration Data",

      description:
        "Get all printed registration data belonging to a specific event. Only registration data with isPrinted set to true is returned.",

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
          name: "page",
          in: "query",
          required: false,

          schema: {
            type: "integer",
            example: 1,
          },
        },

        {
          name: "limit",
          in: "query",
          required: false,

          schema: {
            type: "integer",
            example: 20,
          },
        },

        {
          name: "search",
          in: "query",
          required: false,

          schema: {
            type: "string",
            example: "John",
          },
        },

        {
          name: "sortBy",
          in: "query",
          required: false,

          schema: {
            type: "string",

            enum: ["regNum", "name", "printedAt", "createdAt"],

            example: "printedAt",
          },
        },

        {
          name: "order",
          in: "query",
          required: false,

          schema: {
            type: "string",

            enum: ["asc", "desc"],

            example: "desc",
          },
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
          description: "Printed registration data fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Printed registration data fetched successfully.",

                data: [
                  {
                    _id: "6852b4d04ef5f2e4dbd0d030",

                    eventId: {
                      _id: "6852b4d04ef5f2e4dbd0d003",

                      eventName: "National Convention 2026",

                      eventShortName: "NC2026",
                    },

                    regDataTypeId: {
                      _id: "6852b4d04ef5f2e4dbd0d010",

                      regDataTypeName: "Spot",
                    },

                    name: "John Doe",

                    regNum: "SPOT-001",

                    email: "john@example.com",

                    mobile: "9876543210",

                    mciNumber: "MCI123456",

                    address: "123 Main Street",

                    city: "Hyderabad",

                    state: "Telangana",

                    country: "India",

                    reference: "Friend",

                    note: "Special note",

                    isPrinted: true,

                    printedAt: "2026-09-16T10:00:00.000Z",

                    createdAt: "2026-09-15T10:00:00.000Z",

                    updatedAt: "2026-09-16T10:00:00.000Z",
                  },
                ],

                pagination: {
                  page: 1,

                  limit: 20,

                  total: 65,

                  totalPages: 4,

                  from: 1,

                  to: 20,

                  hasPreviousPage: false,

                  hasNextPage: true,
                },
              },
            },
          },
        },

        // ==========================================
        // 400 - Bad Request
        // ==========================================

        400: badRequest400,

        // ==========================================
        // 401 - Unauthorized
        // ==========================================

        401: unauthorized401,

        // ==========================================
        // 403 - Forbidden
        // ==========================================

        403: forbidden403,

        // ==========================================
        // 404 - Not Found
        // ==========================================

        404: notFound404,

        // ==========================================
        // 500 - Internal Server Error
        // ==========================================

        500: internalServer500,
      },
    },
  },

  // ==========================================
  // Import RegistrationData
  // ==========================================

  "/events/{eventId}/registration-data/import": {
    post: {
      tags: ["Registration Data"],

      summary: "Import Registration Data",

      description:
        "Import registration data from a CSV or Excel file for a specific event. RegDataType is selected separately and registration number is taken from the uploaded file.",

      security: [
        {
          bearerAuth: [],
        },
      ],

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

      requestBody: {
        required: true,

        content: {
          "multipart/form-data": {
            schema: {
              type: "object",

              required: ["regDataTypeId", "file"],

              properties: {
                regDataTypeId: {
                  type: "string",

                  description:
                    "Registration Data Type ID selected from the dropdown.",

                  example: "6852b4d04ef5f2e4dbd0d010",
                },

                file: {
                  type: "string",
                  format: "binary",

                  description:
                    "CSV or Excel file containing name, regNum and optional registration information.",
                },
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: "Registration data imported successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Registration data imported successfully.",

                data: {
                  importedCount: 100,
                },
              },
            },
          },
        },

        400: badRequest400,
        401: unauthorized401,
        403: forbidden403,
        404: notFound404,
        409: conflict409,
        500: internalServer500,
      },
    },
  },

  // ==========================================
  // Print RegistrationData
  // ==========================================

  "/events/{eventId}/registration-data/{id}/print": {
    patch: {
      tags: ["Registration Data"],

      summary: "Print Registration Data (BADGE PRINTING)",

      description:
        "Mark registration data as printed for a specific event. This API sets isPrinted to true.",

      security: [
        {
          bearerAuth: [],
        },
      ],

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
          name: "id",
          in: "path",
          required: true,

          schema: {
            type: "string",
          },

          example: "6852b4d04ef5f2e4dbd0d030",
        },
      ],

      responses: {
        200: {
          description: "Registration data marked as printed successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Registration data marked as printed successfully.",

                data: {
                  _id: "6852b4d04ef5f2e4dbd0d030",

                  eventId: {
                    _id: "6852b4d04ef5f2e4dbd0d003",

                    eventName: "National Convention 2026",

                    eventShortName: "NC2026",
                  },

                  regDataTypeId: {
                    _id: "6852b4d04ef5f2e4dbd0d010",

                    regDataTypeName: "Spot",
                  },

                  name: "John Doe",

                  regNum: "SPOT-001",

                  email: "john@example.com",

                  mobile: "9876543210",

                  mciNumber: "MCI123456",

                  address: "123 Main Street",

                  city: "Hyderabad",

                  state: "Telangana",

                  country: "India",

                  reference: "Friend",

                  note: "Special note",

                  isPrinted: true,

                  printedAt: "2026-09-16T10:00:00.000Z",

                  createdAt: "2026-09-15T10:00:00.000Z",

                  updatedAt: "2026-09-16T10:00:00.000Z",
                },
              },
            },
          },
        },

        400: badRequest400,
        401: unauthorized401,
        403: forbidden403,
        404: notFound404,
        500: internalServer500,
      },
    },
  },

  // ==========================================
  // Get Printed RegistrationData By ID
  // ==========================================

  "/events/{eventId}/registration-data/printed/{id}": {
    get: {
      tags: ["Registration Data"],

      summary: "Get Printed Registration Data By ID",

      description:
        "Get printed registration data by ID for a specific event. Only registration data with isPrinted set to true can be returned.",

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
          name: "id",
          in: "path",
          required: true,

          schema: {
            type: "string",
          },

          example: "6852b4d04ef5f2e4dbd0d030",
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
          description: "Printed registration data fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Printed registration data fetched successfully.",

                data: {
                  _id: "6852b4d04ef5f2e4dbd0d030",

                  eventId: {
                    _id: "6852b4d04ef5f2e4dbd0d003",

                    eventName: "National Convention 2026",

                    eventShortName: "NC2026",
                  },

                  regDataTypeId: {
                    _id: "6852b4d04ef5f2e4dbd0d010",

                    regDataTypeName: "Spot",
                  },

                  name: "John Doe",

                  regNum: "SPOT-001",

                  email: "john@example.com",

                  mobile: "9876543210",

                  mciNumber: "MCI123456",

                  address: "123 Main Street",

                  city: "Hyderabad",

                  state: "Telangana",

                  country: "India",

                  reference: "Friend",

                  note: "Special note",

                  isPrinted: true,

                  printedAt: "2026-09-16T10:00:00.000Z",

                  createdAt: "2026-09-15T10:00:00.000Z",

                  updatedAt: "2026-09-16T10:00:00.000Z",
                },
              },
            },
          },
        },

        // ==========================================
        // 400 - Bad Request
        // ==========================================

        400: badRequest400,

        // ==========================================
        // 401 - Unauthorized
        // ==========================================

        401: unauthorized401,

        // ==========================================
        // 403 - Forbidden
        // ==========================================

        403: forbidden403,

        // ==========================================
        // 404 - Not Found
        // ==========================================

        404: notFound404,

        // ==========================================
        // 500 - Internal Server Error
        // ==========================================

        500: internalServer500,
      },
    },
  },

  // ==========================================
  // Export RegistrationData
  // ==========================================

  "/events/{eventId}/registration-data/export": {
    get: {
      tags: ["Registration Data"],

      summary: "Export Registration Data",

      description:
        "Export all registration data for a specific event, including registration details, printing information, all categories, group categories, privileges, and scan information category-wise.",

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
          description: "Registration data exported successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Registration data exported successfully.",

                data: {
                  event: {
                    _id: "6852b4d04ef5f2e4dbd0d003",
                    eventName: "National Convention 2026",
                    eventShortName: "NC2026",
                  },

                  registrations: [
                    {
                      _id: "6852b4d04ef5f2e4dbd0d030",

                      eventId: "6852b4d04ef5f2e4dbd0d003",

                      regDataType: {
                        _id: "6852b4d04ef5f2e4dbd0d010",
                        regDataTypeName: "Spot",
                      },

                      name: "John Doe",

                      regNum: "SPOT-001",

                      email: "john@example.com",

                      mobile: "9876543210",

                      mciNumber: "MCI123456",

                      address: "123 Main Street",

                      city: "Hyderabad",

                      state: "Telangana",

                      country: "India",

                      reference: "Friend",

                      note: "Special note",

                      // ==========================================
                      // Printing Information
                      // ==========================================

                      printing: {
                        isPrinted: true,
                        printedAt: "2026-09-16T10:00:00.000Z",
                      },

                      // ==========================================
                      // Category-wise Information
                      // ==========================================

                      categories: [
                        {
                          category: {
                            _id: "6852b4d04ef5f2e4dbd0d101",

                            categoryCode: "CAT-001",

                            categoryName: "General Session",

                            status: "active",

                            day: "Day 1",

                            hall: "Hall A",

                            session: "Morning",

                            time: "10:00 AM",

                            groupCategory: {
                              _id: "6852b4d04ef5f2e4dbd0d201",

                              groupCategoryName: "Main Sessions",

                              description: "Main event sessions",
                            },
                          },

                          privilege: {
                            _id: "6852b4d04ef5f2e4dbd0d301",

                            isAllowed: true,
                          },

                          scan: {
                            _id: "6852b4d04ef5f2e4dbd0d401",

                            isScanned: true,

                            scannedAt: "2026-09-16T11:30:00.000Z",

                            createdAt: "2026-09-16T11:30:00.000Z",

                            updatedAt: "2026-09-16T11:30:00.000Z",
                          },
                        },

                        {
                          category: {
                            _id: "6852b4d04ef5f2e4dbd0d102",

                            categoryCode: "CAT-002",

                            categoryName: "Lunch",

                            status: "active",

                            day: "Day 1",

                            hall: "Dining Hall",

                            session: "Lunch",

                            time: "01:00 PM",

                            groupCategory: {
                              _id: "6852b4d04ef5f2e4dbd0d202",

                              groupCategoryName: "Food",

                              description: "Food related categories",
                            },
                          },

                          privilege: {
                            _id: "6852b4d04ef5f2e4dbd0d302",

                            isAllowed: true,
                          },

                          scan: {
                            _id: null,

                            isScanned: false,

                            scannedAt: null,

                            createdAt: null,

                            updatedAt: null,
                          },
                        },
                      ],

                      createdAt: "2026-09-15T10:00:00.000Z",

                      updatedAt: "2026-09-16T10:00:00.000Z",
                    },
                  ],
                },
              },
            },
          },
        },

        // ==========================================
        // 400 - Bad Request
        // ==========================================

        400: badRequest400,

        // ==========================================
        // 401 - Unauthorized
        // ==========================================

        401: unauthorized401,

        // ==========================================
        // 403 - Forbidden
        // ==========================================

        403: forbidden403,

        // ==========================================
        // 404 - Not Found
        // ==========================================

        404: notFound404,

        // ==========================================
        // 500 - Internal Server Error
        // ==========================================

        500: internalServer500,
      },
    },
  },

  // ==========================================
  // Get / Update / Delete By ID
  // ==========================================

  "/events/{eventId}/registration-data/{id}": {
    // ==========================================
    // Get RegistrationData By ID
    // ==========================================

    get: {
      tags: ["Registration Data"],

      summary: "Get Registration Data By ID",

      description: "Get registration data by ID for a specific event.",

      security: [
        {
          bearerAuth: [],
        },
      ],

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
          name: "id",
          in: "path",
          required: true,

          schema: {
            type: "string",
          },

          example: "6852b4d04ef5f2e4dbd0d030",
        },
      ],

      responses: {
        200: {
          description: "Registration data fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Registration data fetched successfully.",

                data: {
                  _id: "6852b4d04ef5f2e4dbd0d030",

                  eventId: {
                    _id: "6852b4d04ef5f2e4dbd0d003",

                    eventName: "National Convention 2026",

                    eventShortName: "NC2026",
                  },

                  regDataTypeId: {
                    _id: "6852b4d04ef5f2e4dbd0d010",

                    regDataTypeName: "Spot",
                  },

                  name: "John Doe",

                  regNum: "SPOT-001",

                  email: "john@example.com",

                  mobile: "9876543210",

                  mciNumber: "MCI123456",

                  address: "123 Main Street",

                  city: "Hyderabad",

                  state: "Telangana",

                  country: "India",

                  reference: "Friend",

                  note: "Special note",

                  isPrinted: false,

                  printedAt: null,
                },
              },
            },
          },
        },

        400: badRequest400,
        401: unauthorized401,
        403: forbidden403,
        404: notFound404,
        500: internalServer500,
      },
    },

    // ==========================================
    // Update RegistrationData
    // ==========================================

    patch: {
      tags: ["Registration Data"],

      summary: "Update Registration Data",

      description:
        "Update registration data belonging to a specific event. Registration number cannot be changed.",

      security: [
        {
          bearerAuth: [],
        },
      ],

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
          name: "id",
          in: "path",
          required: true,

          schema: {
            type: "string",
          },

          example: "6852b4d04ef5f2e4dbd0d030",
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RegistrationDataUpdateRequest",
            },

            example: {
              regDataTypeId: "6852b4d04ef5f2e4dbd0d010",

              name: "John Doe Updated",

              email: "john.updated@example.com",

              mobile: "9876543211",

              city: "Hyderabad",

              state: "Telangana",

              country: "India",

              note: "Updated note",

              isPrinted: false,

              printedAt: null,
            },
          },
        },
      },

      responses: {
        200: {
          description: "Registration data updated successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Registration data updated successfully.",

                data: {
                  _id: "6852b4d04ef5f2e4dbd0d030",

                  eventId: {
                    _id: "6852b4d04ef5f2e4dbd0d003",

                    eventName: "National Convention 2026",

                    eventShortName: "NC2026",
                  },

                  regDataTypeId: {
                    _id: "6852b4d04ef5f2e4dbd0d010",

                    regDataTypeName: "Spot",
                  },

                  name: "John Doe Updated",

                  regNum: "SPOT-001",

                  email: "john.updated@example.com",

                  mobile: "9876543211",

                  city: "Hyderabad",

                  state: "Telangana",

                  country: "India",

                  note: "Updated note",
                },
              },
            },
          },
        },

        400: badRequest400,
        401: unauthorized401,
        403: forbidden403,
        404: notFound404,
        422: validation422,
        500: internalServer500,
      },
    },

    // ==========================================
    // Delete RegistrationData
    // ==========================================

    delete: {
      tags: ["Registration Data"],

      summary: "Delete Registration Data",

      description: "Delete registration data belonging to a specific event.",

      security: [
        {
          bearerAuth: [],
        },
      ],

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
          name: "id",
          in: "path",
          required: true,

          schema: {
            type: "string",
          },

          example: "6852b4d04ef5f2e4dbd0d030",
        },
      ],

      responses: {
        200: {
          description: "Registration data deleted successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Registration data deleted successfully.",

                data: null,
              },
            },
          },
        },

        400: badRequest400,
        401: unauthorized401,
        403: forbidden403,
        404: notFound404,
        500: internalServer500,
      },
    },
  },
};

export default registrationDataPaths;
