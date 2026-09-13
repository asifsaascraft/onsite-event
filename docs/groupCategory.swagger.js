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

const groupCategoryPaths = {
  // ==========================================
  // Create GroupCategory
  // ==========================================

  "/events/{eventId}/group-categories": {
    post: {
      tags: ["Group Category"],

      summary: "Create Group Category",

      description:
        "Create a group category for a specific event. Admin can create for any event. Operator can create only for their assigned event.",

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

          example:
            "6852b4d04ef5f2e4dbd0d003",
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref:
                "#/components/schemas/GroupCategoryRequest",
            },

            example: {
              groupCategoryName:
                "VIP Delegates",
              description:
                "Special category for VIP delegates.",
            },
          },
        },
      },

      responses: {
        201: {
          description:
            "Group category created successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Group category created successfully.",

                data: {
                  _id:
                    "6852b4d04ef5f2e4dbd0d005",

                  eventId:
                    "6852b4d04ef5f2e4dbd0d003",

                  groupCategoryName:
                    "VIP Delegates",

                  description:
                    "Special category for VIP delegates.",

                  createdAt:
                    "2026-09-10T10:00:00.000Z",

                  updatedAt:
                    "2026-09-10T10:00:00.000Z",
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
    // Get All GroupCategories
    // ==========================================

    get: {
      tags: ["Group Category"],

      summary: "Get Event Group Categories",

      description:
        "Get all group categories belonging to a specific event.",

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

          example:
            "6852b4d04ef5f2e4dbd0d003",
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
            example: "VIP",
          },
        },

        {
          name: "sortBy",
          in: "query",

          schema: {
            type: "string",

            enum: [
              "groupCategoryName",
              "createdAt",
            ],

            example:
              "createdAt",
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
            "Group categories fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Group categories fetched successfully.",

                data: [
                  {
                    _id:
                      "6852b4d04ef5f2e4dbd0d005",

                    eventId:
                      "6852b4d04ef5f2e4dbd0d003",

                    groupCategoryName:
                      "VIP Delegates",

                    description:
                      "Special category for VIP delegates.",

                    createdAt:
                      "2026-09-10T10:00:00.000Z",

                    updatedAt:
                      "2026-09-10T10:00:00.000Z",
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
  },

  // ==========================================
  // Get / Update / Delete By ID
  // ==========================================

  "/events/{eventId}/group-categories/{id}": {
    get: {
      tags: ["Group Category"],

      summary: "Get Group Category By ID",

      description:
        "Get a group category by ID for a specific event.",

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

          example:
            "6852b4d04ef5f2e4dbd0d003",
        },

        {
          name: "id",
          in: "path",
          required: true,

          schema: {
            type: "string",
          },

          example:
            "6852b4d04ef5f2e4dbd0d005",
        },
      ],

      responses: {
        200: {
          description:
            "Group category fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Group category fetched successfully.",

                data: {
                  _id:
                    "6852b4d04ef5f2e4dbd0d005",

                  eventId:
                    "6852b4d04ef5f2e4dbd0d003",

                  groupCategoryName:
                    "VIP Delegates",

                  description:
                    "Special category for VIP delegates.",

                  createdAt:
                    "2026-09-10T10:00:00.000Z",

                  updatedAt:
                    "2026-09-10T10:00:00.000Z",
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
    // Update GroupCategory
    // ==========================================

    patch: {
      tags: ["Group Category"],

      summary: "Update Group Category",

      description:
        "Update a group category belonging to a specific event.",

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

          example:
            "6852b4d04ef5f2e4dbd0d003",
        },

        {
          name: "id",
          in: "path",
          required: true,

          schema: {
            type: "string",
          },

          example:
            "6852b4d04ef5f2e4dbd0d005",
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref:
                "#/components/schemas/GroupCategoryRequest",
            },

            example: {
              groupCategoryName:
                "VIP Delegates Updated",

              description:
                "Updated category description.",
            },
          },
        },
      },

      responses: {
        200: {
          description:
            "Group category updated successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Group category updated successfully.",

                data: {
                  _id:
                    "6852b4d04ef5f2e4dbd0d005",

                  eventId:
                    "6852b4d04ef5f2e4dbd0d003",

                  groupCategoryName:
                    "VIP Delegates Updated",

                  description:
                    "Updated category description.",
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
    // Delete GroupCategory
    // ==========================================

    delete: {
      tags: ["Group Category"],

      summary: "Delete Group Category",

      description:
        "Delete a group category belonging to a specific event.",

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

          example:
            "6852b4d04ef5f2e4dbd0d003",
        },

        {
          name: "id",
          in: "path",
          required: true,

          schema: {
            type: "string",
          },

          example:
            "6852b4d04ef5f2e4dbd0d005",
        },
      ],

      responses: {
        200: {
          description:
            "Group category deleted successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Group category deleted successfully.",

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

export default groupCategoryPaths;