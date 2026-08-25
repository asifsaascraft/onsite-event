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

// ==========================================
// Event Swagger Paths
// ==========================================

const eventPaths = {
  // ==========================================
  // Create Event
  // ==========================================

  "/events": {
    post: {
      tags: ["Events"],

      summary: "Create Event",

      description:
        "Create a new event with organizer, venue, operator login code, dates and optional event logo.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: true,

        content: {
          "multipart/form-data": {
            schema: {
              type: "object",

              properties: {
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
                  example:
                    "6852b4d04ef5f2e4dbd0d001",
                },

                venueId: {
                  type: "string",
                  example:
                    "6852b4d04ef5f2e4dbd0d002",
                },

                startDate: {
                  type: "string",
                  format: "date-time",
                  example:
                    "2026-09-10T00:00:00.000Z",
                },

                endDate: {
                  type: "string",
                  format: "date-time",
                  example:
                    "2026-09-12T23:59:59.000Z",
                },

                uploadEventLogo: {
                  type: "string",
                  format: "binary",
                },
              },

              required: [
                "eventName",
                "eventShortName",
                "operatorLoginCode",
                "organizerId",
                "venueId",
                "startDate",
                "endDate",
              ],
            },
          },
        },
      },

      responses: {
        201: created201,

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
    // Get All Events
    // ==========================================

    get: {
      tags: ["Events"],

      summary: "Get All Events",

      description:
        "Get all events with pagination, search, filtering and sorting.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
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
            example: "Expo",
          },
        },

        {
          name: "organizerId",

          in: "query",

          schema: {
            type: "string",
          },

          example:
            "6852b4d04ef5f2e4dbd0d001",
        },

        {
          name: "venueId",

          in: "query",

          schema: {
            type: "string",
          },

          example:
            "6852b4d04ef5f2e4dbd0d002",
        },

        {
          name: "sortBy",

          in: "query",

          schema: {
            type: "string",

            enum: [
              "eventName",
              "eventShortName",
              "startDate",
              "endDate",
              "createdAt",
            ],

            example: "createdAt",
          },
        },

        {
          name: "order",

          in: "query",

          schema: {
            type: "string",

            enum: [
              "asc",
              "desc",
            ],

            example: "desc",
          },
        },
      ],

      responses: {
        200: {
          description:
            "Events fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Events fetched successfully.",

                data: [
                  {
                    _id:
                      "6852b4d04ef5f2e4dbd0d003",

                    eventName:
                      "International Expo 2026",

                    eventShortName:
                      "EXPO2026",

                    operatorLoginCode:
                      "EXPO2026-OP01",

                    organizerId:
                      "6852b4d04ef5f2e4dbd0d001",

                    venueId:
                      "6852b4d04ef5f2e4dbd0d002",

                    startDate:
                      "2026-09-10T00:00:00.000Z",

                    endDate:
                      "2026-09-12T23:59:59.000Z",

                    uploadEventLogo:
                      "https://example.com/event-logo.png",

                    dynamicStatus:
                      "Upcoming",

                    createdAt:
                      "2026-08-25T10:00:00.000Z",

                    updatedAt:
                      "2026-08-25T10:00:00.000Z",
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

        500: internalServer500,
      },
    },
  },

  // ==========================================
  // Get Event By ID
  // ==========================================

  "/events/{id}": {
    get: {
      tags: ["Events"],

      summary: "Get Event By ID",

      description:
        "Get a single event by MongoDB ID.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "string",
          },

          example:
            "6852b4d04ef5f2e4dbd0d003",
        },
      ],

      responses: {
        200: {
          description:
            "Event fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Event fetched successfully.",

                data: {
                  _id:
                    "6852b4d04ef5f2e4dbd0d003",

                  eventName:
                    "International Expo 2026",

                  eventShortName:
                    "EXPO2026",

                  operatorLoginCode:
                    "EXPO2026-OP01",

                  organizerId:
                    "6852b4d04ef5f2e4dbd0d001",

                  venueId:
                    "6852b4d04ef5f2e4dbd0d002",

                  startDate:
                    "2026-09-10T00:00:00.000Z",

                  endDate:
                    "2026-09-12T23:59:59.000Z",

                  uploadEventLogo:
                    "https://example.com/event-logo.png",

                  dynamicStatus:
                    "Upcoming",
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
    // Update Event
    // ==========================================

    patch: {
      tags: ["Events"],

      summary: "Update Event",

      description:
        "Update event information and optionally replace the event logo.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "string",
          },

          example:
            "6852b4d04ef5f2e4dbd0d003",
        },
      ],

      requestBody: {
        required: true,

        content: {
          "multipart/form-data": {
            schema: {
              type: "object",

              properties: {
                eventName: {
                  type: "string",
                  example:
                    "International Expo 2026 Updated",
                },

                eventShortName: {
                  type: "string",
                  example: "EXPO2026NEW",
                },

                operatorLoginCode: {
                  type: "string",
                  example: "EXPO2026-OP02",
                },

                organizerId: {
                  type: "string",
                  example:
                    "6852b4d04ef5f2e4dbd0d001",
                },

                venueId: {
                  type: "string",
                  example:
                    "6852b4d04ef5f2e4dbd0d002",
                },

                startDate: {
                  type: "string",
                  format: "date-time",
                },

                endDate: {
                  type: "string",
                  format: "date-time",
                },

                uploadEventLogo: {
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
          description:
            "Event updated successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Event updated successfully.",

                data: {
                  _id:
                    "6852b4d04ef5f2e4dbd0d003",

                  eventName:
                    "International Expo 2026 Updated",

                  eventShortName:
                    "EXPO2026NEW",

                  operatorLoginCode:
                    "EXPO2026-OP02",
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
    // Delete Event
    // ==========================================

    delete: {
      tags: ["Events"],

      summary: "Delete Event",

      description:
        "Delete an event and its event logo.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: "id",

          in: "path",

          required: true,

          schema: {
            type: "string",
          },

          example:
            "6852b4d04ef5f2e4dbd0d003",
        },
      ],

      responses: {
        200: {
          description:
            "Event deleted successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Event deleted successfully.",

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

export default eventPaths;