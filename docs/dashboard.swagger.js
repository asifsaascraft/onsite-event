import {
  badRequest400,
  unauthorized401,
  forbidden403,
  notFound404,
  internalServer500,
} from "./responses.js";

const dashboardPaths = {
  // ==========================================
  // Get Dashboard Stats
  // ==========================================

  "/events/{eventId}/dashboard/stats": {
    get: {
      tags: ["Dashboard"],

      summary: "Get Dashboard Stats",

      description:
        "Get dashboard statistics for a specific event, including registration data, badge printing, scan activity, category coverage, registration data type statistics, day-wise printing statistics, and data quality information.",

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
          description: "Dashboard stats fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Dashboard stats fetched successfully.",

                data: {
                  // ==========================================
                  // Main Stats
                  // ==========================================

                  stats: {
                    totalAttendees: 1000,

                    badgesPrinted: 850,

                    badgesNotPrinted: 150,

                    printCoverage: 85,

                    scansTotal: 1200,

                    scansToday: 350,

                    categories: 8,
                  },

                  // ==========================================
                  // Users By Registration Data Type
                  // ==========================================

                  usersByType: [
                    {
                      type: "Delegate",

                      total: 600,

                      printed: 520,
                    },

                    {
                      type: "Faculty",

                      total: 200,

                      printed: 180,
                    },

                    {
                      type: "Speaker",

                      total: 100,

                      printed: 90,
                    },

                    {
                      type: "Sponsor",

                      total: 100,

                      printed: 60,
                    },
                  ],

                  // ==========================================
                  // Day Wise Printed
                  // ==========================================

                  dayWisePrinted: [
                    {
                      day: "2026-09-12",

                      Delegate: 300,

                      Faculty: 100,

                      Speaker: 50,
                    },

                    {
                      day: "2026-09-13",

                      Delegate: 220,

                      Faculty: 80,

                      Speaker: 40,
                    },
                  ],

                  // ==========================================
                  // Day Wise Total
                  // ==========================================

                  dayWiseTotal: [
                    {
                      day: "2026-09-12",

                      Delegate: 350,

                      Faculty: 120,

                      Speaker: 60,
                    },

                    {
                      day: "2026-09-13",

                      Delegate: 250,

                      Faculty: 80,

                      Speaker: 40,
                    },
                  ],

                  // ==========================================
                  // Scan Activity By Hour
                  // ==========================================

                  scanActivity: [
                    {
                      hour: "00:00",

                      scans: 0,
                    },

                    {
                      hour: "08:00",

                      scans: 12,
                    },

                    {
                      hour: "09:00",

                      scans: 45,
                    },

                    {
                      hour: "10:00",

                      scans: 72,
                    },

                    {
                      hour: "11:00",

                      scans: 98,
                    },

                    {
                      hour: "12:00",

                      scans: 65,
                    },
                  ],

                  // ==========================================
                  // Scan By Group
                  // ==========================================

                  scansByGroup: [
                    {
                      groupName: "Food Scan",

                      categories: [
                        {
                          categoryName:
                            "Breakfast - 13/09/2026",

                          scanned: 79,

                          total: 120,
                        },

                        {
                          categoryName:
                            "DINNER - 12/09/2026",

                          scanned: 293,

                          total: 340,
                        },

                        {
                          categoryName:
                            "FACULTY LUNCH - 12/09/2026",

                          scanned: 18,

                          total: 45,
                        },

                        {
                          categoryName:
                            "GALA DINNER - 12/09/2026",

                          scanned: 272,

                          total: 350,
                        },

                        {
                          categoryName:
                            "LUNCH - 12/09/2026",

                          scanned: 452,

                          total: 500,
                        },

                        {
                          categoryName:
                            "LUNCH - 13/09/2026",

                          scanned: 354,

                          total: 400,
                        },
                      ],
                    },

                    {
                      groupName: "Gift",

                      categories: [
                        {
                          categoryName: "KIT",

                          scanned: 462,

                          total: 600,
                        },
                      ],
                    },

                    {
                      groupName: "Certificate",

                      categories: [
                        {
                          categoryName: "Certificate",

                          scanned: 380,

                          total: 500,
                        },
                      ],
                    },
                  ],

                  // ==========================================
                  // Data Quality
                  // ==========================================

                  dataQuality: {
                    missingEmail: 25,

                    missingPhone: 40,

                    missingImc: 15,
                  },
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
  // Get Recent Scans
  // ==========================================

  "/events/{eventId}/dashboard/recent-scans": {
    get: {
      tags: ["Dashboard"],

      summary: "Get Recent Scans",

      description:
        "Get the most recent registration scans for a specific event.",

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
          name: "limit",
          in: "query",
          required: false,

          schema: {
            type: "integer",

            minimum: 1,

            maximum: 100,

            default: 20,
          },

          example: 20,
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
          description: "Recent scans fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Recent scans fetched successfully.",

                data: [
                  {
                    _id: "6852b4d04ef5f2e4dbd0d080",

                    regNum: "SPOT-120",

                    name: "John Doe",

                    category: "KIT",

                    scannedAt:
                      "2026-09-16T10:30:00.000Z",
                  },

                  {
                    _id: "6852b4d04ef5f2e4dbd0d081",

                    regNum: "SPOT-119",

                    name: "Jane Smith",

                    category:
                      "Breakfast - 13/09/2026",

                    scannedAt:
                      "2026-09-16T10:28:00.000Z",
                  },

                  {
                    _id: "6852b4d04ef5f2e4dbd0d082",

                    regNum: "SPOT-118",

                    name: "Robert Johnson",

                    category: "Certificate",

                    scannedAt:
                      "2026-09-16T10:25:00.000Z",
                  },
                ],
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
};

export default dashboardPaths;