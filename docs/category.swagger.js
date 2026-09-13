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

const categoryPaths = {
  // ==========================================
  // Create Category
  // ==========================================

  "/events/{eventId}/categories": {
    post: {
      tags: ["Category"],

      summary: "Create Category",

      description:
        "Create a category for a specific event. Admin can create for any event. Operator can create only for their assigned event.",

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
                "#/components/schemas/CategoryRequest",
            },

            example: {
              categoryCode: "CAT001",

              categoryName:
                "General Delegates",

              groupCategoryId:
                "6852b4d04ef5f2e4dbd0d004",

              status: "active",

              day: "Day 1",

              hall: "Hall A",

              session: "Morning Session",

              time: "10:00 AM",
            },
          },
        },
      },

      responses: {
        201: {
          description:
            "Category created successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Category created successfully.",

                data: {
                  _id:
                    "6852b4d04ef5f2e4dbd0d005",

                  eventId: {
                    _id:
                      "6852b4d04ef5f2e4dbd0d003",

                    eventName:
                      "National Convention 2026",

                    eventShortName:
                      "NC2026",
                  },

                  categoryCode: "CAT001",

                  categoryName:
                    "General Delegates",

                  groupCategoryId: {
                    _id:
                      "6852b4d04ef5f2e4dbd0d004",

                    groupCategoryName:
                      "Delegates",

                    description:
                      "General delegates category.",
                  },

                  status: "active",

                  day: "Day 1",

                  hall: "Hall A",

                  session: "Morning Session",

                  time: "10:00 AM",

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
    // Get All Categories
    // ==========================================

    get: {
      tags: ["Category"],

      summary: "Get Event Categories",

      description:
        "Get all categories belonging to a specific event. Both active and inactive categories can be returned.",

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
            example: "General",
          },
        },

        {
          name: "sortBy",
          in: "query",

          schema: {
            type: "string",

            enum: [
              "categoryCode",
              "categoryName",
              "status",
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
            "Categories fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Categories fetched successfully.",

                data: [
                  {
                    _id:
                      "6852b4d04ef5f2e4dbd0d005",

                    eventId: {
                      _id:
                        "6852b4d04ef5f2e4dbd0d003",

                      eventName:
                        "National Convention 2026",

                      eventShortName:
                        "NC2026",
                    },

                    categoryCode:
                      "CAT001",

                    categoryName:
                      "General Delegates",

                    groupCategoryId: {
                      _id:
                        "6852b4d04ef5f2e4dbd0d004",

                      groupCategoryName:
                        "Delegates",

                      description:
                        "General delegates category.",
                    },

                    status: "active",

                    day: "Day 1",

                    hall: "Hall A",

                    session:
                      "Morning Session",

                    time: "10:00 AM",

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
  // Get Active Categories
  // ==========================================

  "/events/{eventId}/categories/active": {
    get: {
      tags: ["Category"],

      summary: "Get Active Categories",

      description:
        "Get only active categories belonging to a specific event.",

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
            example: "General",
          },
        },

        {
          name: "sortBy",
          in: "query",

          schema: {
            type: "string",

            enum: [
              "categoryCode",
              "categoryName",
              "createdAt",
            ],

            example: "categoryName",
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

            example: "asc",
          },
        },
      ],

      responses: {
        200: {
          description:
            "Active categories fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Active categories fetched successfully.",

                data: [
                  {
                    _id:
                      "6852b4d04ef5f2e4dbd0d005",

                    eventId: {
                      _id:
                        "6852b4d04ef5f2e4dbd0d003",

                      eventName:
                        "National Convention 2026",

                      eventShortName:
                        "NC2026",
                    },

                    categoryCode:
                      "CAT001",

                    categoryName:
                      "General Delegates",

                    groupCategoryId: {
                      _id:
                        "6852b4d04ef5f2e4dbd0d004",

                      groupCategoryName:
                        "Delegates",

                      description:
                        "General delegates category.",
                    },

                    status: "active",

                    day: "Day 1",

                    hall: "Hall A",

                    session:
                      "Morning Session",

                    time: "10:00 AM",

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

  "/events/{eventId}/categories/{id}": {
    // ==========================================
    // Get Category By ID
    // ==========================================

    get: {
      tags: ["Category"],

      summary: "Get Category By ID",

      description:
        "Get a category by ID for a specific event.",

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
            "Category fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Category fetched successfully.",

                data: {
                  _id:
                    "6852b4d04ef5f2e4dbd0d005",

                  eventId: {
                    _id:
                      "6852b4d04ef5f2e4dbd0d003",

                    eventName:
                      "National Convention 2026",

                    eventShortName:
                      "NC2026",
                  },

                  categoryCode:
                    "CAT001",

                  categoryName:
                    "General Delegates",

                  groupCategoryId: {
                    _id:
                      "6852b4d04ef5f2e4dbd0d004",

                    groupCategoryName:
                      "Delegates",

                    description:
                      "General delegates category.",
                  },

                  status: "active",

                  day: "Day 1",

                  hall: "Hall A",

                  session:
                    "Morning Session",

                  time: "10:00 AM",

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
    // Update Category
    // ==========================================

    patch: {
      tags: ["Category"],

      summary: "Update Category",

      description:
        "Update a category belonging to a specific event.",

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
                "#/components/schemas/CategoryRequest",
            },

            example: {
              categoryCode:
                "CAT001",

              categoryName:
                "General Delegates Updated",

              groupCategoryId:
                "6852b4d04ef5f2e4dbd0d004",

              status: "inactive",

              day: "Day 2",

              hall: "Hall B",

              session:
                "Evening Session",

              time: "06:00 PM",
            },
          },
        },
      },

      responses: {
        200: {
          description:
            "Category updated successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Category updated successfully.",

                data: {
                  _id:
                    "6852b4d04ef5f2e4dbd0d005",

                  eventId: {
                    _id:
                      "6852b4d04ef5f2e4dbd0d003",

                    eventName:
                      "National Convention 2026",

                    eventShortName:
                      "NC2026",
                  },

                  categoryCode:
                    "CAT001",

                  categoryName:
                    "General Delegates Updated",

                  groupCategoryId: {
                    _id:
                      "6852b4d04ef5f2e4dbd0d004",

                    groupCategoryName:
                      "Delegates",

                    description:
                      "General delegates category.",
                  },

                  status: "inactive",

                  day: "Day 2",

                  hall: "Hall B",

                  session:
                    "Evening Session",

                  time: "06:00 PM",
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
    // Delete Category
    // ==========================================

    delete: {
      tags: ["Category"],

      summary: "Delete Category",

      description:
        "Delete a category belonging to a specific event.",

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
            "Category deleted successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Category deleted successfully.",

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

export default categoryPaths;