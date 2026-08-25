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
// Organizer Swagger Paths
// ==========================================

const organizerPaths = {
  // ==========================================
  // Create Organizer
  // ==========================================

  "/organizers": {
    post: {
      tags: ["Organizers"],

      summary: "Create Organizer",

      description:
        "Create a new organizer. Only the admin can create organizers.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            example: {
              organizerName:
                "ABC Events Pvt Ltd",

              contactPersonName:
                "John Doe",

              contactPersonEmail:
                "john@example.com",

              contactPersonMobile:
                "9876543210",
            },
          },
        },
      },

      responses: {
        201: created201,

        400: badRequest400,

        401: unauthorized401,

        403: forbidden403,

        409: conflict409,

        422: validation422,

        500: internalServer500,
      },
    },

    // ==========================================
    // Get All Organizers
    // ==========================================

    get: {
      tags: ["Organizers"],

      summary: "Get All Organizers",

      description:
        "Get organizers with pagination, search and sorting.",

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

            example: "ABC",
          },
        },

        {
          name: "sortBy",

          in: "query",

          schema: {
            type: "string",

            enum: [
              "organizerName",
              "contactPersonName",
              "contactPersonEmail",
              "contactPersonMobile",
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
            "Organizers fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Organizers fetched successfully.",

                data: [
                  {
                    _id:
                      "6852b4d04ef5f2e4dbd0d001",

                    organizerName:
                      "ABC Events Pvt Ltd",

                    contactPersonName:
                      "John Doe",

                    contactPersonEmail:
                      "john@example.com",

                    contactPersonMobile:
                      "9876543210",

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

        401: unauthorized401,

        403: forbidden403,

        500: internalServer500,
      },
    },
  },

  // ==========================================
  // Get Organizer By ID
  // ==========================================

  "/organizers/{id}": {
    get: {
      tags: ["Organizers"],

      summary: "Get Organizer By ID",

      description:
        "Get a single organizer using its MongoDB ID.",

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
            "6852b4d04ef5f2e4dbd0d001",
        },
      ],

      responses: {
        200: {
          description:
            "Organizer fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Organizer fetched successfully.",

                data: {
                  _id:
                    "6852b4d04ef5f2e4dbd0d001",

                  organizerName:
                    "ABC Events Pvt Ltd",

                  contactPersonName:
                    "John Doe",

                  contactPersonEmail:
                    "john@example.com",

                  contactPersonMobile:
                    "9876543210",

                  createdAt:
                    "2026-08-25T10:00:00.000Z",

                  updatedAt:
                    "2026-08-25T10:00:00.000Z",
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
    // Update Organizer
    // ==========================================

    patch: {
      tags: ["Organizers"],

      summary: "Update Organizer",

      description:
        "Update organizer information. Any provided field can be updated.",

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
            "6852b4d04ef5f2e4dbd0d001",
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            example: {
              organizerName:
                "ABC Events Updated Pvt Ltd",

              contactPersonName:
                "John Updated",

              contactPersonEmail:
                "john.updated@example.com",

              contactPersonMobile:
                "9876543211",
            },
          },
        },
      },

      responses: {
        200: {
          description:
            "Organizer updated successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Organizer updated successfully.",

                data: {
                  _id:
                    "6852b4d04ef5f2e4dbd0d001",

                  organizerName:
                    "ABC Events Updated Pvt Ltd",

                  contactPersonName:
                    "John Updated",

                  contactPersonEmail:
                    "john.updated@example.com",

                  contactPersonMobile:
                    "9876543211",
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

    // ==========================================
    // Delete Organizer
    // ==========================================

    delete: {
      tags: ["Organizers"],

      summary: "Delete Organizer",

      description:
        "Delete an organizer. Only the admin can delete organizers.",

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
            "6852b4d04ef5f2e4dbd0d001",
        },
      ],

      responses: {
        200: {
          description:
            "Organizer deleted successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Organizer deleted successfully.",

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

export default organizerPaths;