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

const privilegePaths = {
  // ==========================================
  // Create Privilege
  // ==========================================

  "/events/{eventId}/privileges": {
    post: {
      tags: ["Privilege"],

      summary: "Create Privilege",

      description:
        "Create a privilege for a specific event, registration data type and category.",

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
                "#/components/schemas/PrivilegeRequest",
            },

            example: {
              regDataTypeId:
                "6852b4d04ef5f2e4dbd0d010",

              categoryId:
                "6852b4d04ef5f2e4dbd0d020",

              isAllowed: true,
            },
          },
        },
      },

      responses: {
        201: {
          description:
            "Privilege created successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Privilege created successfully.",

                data: {
                  _id:
                    "6852b4d04ef5f2e4dbd0d030",

                  eventId: {
                    _id:
                      "6852b4d04ef5f2e4dbd0d003",

                    eventName:
                      "National Convention 2026",

                    eventShortName:
                      "NC2026",
                  },

                  regDataTypeId: {
                    _id:
                      "6852b4d04ef5f2e4dbd0d010",

                    regDataTypeName:
                      "Delegate",
                  },

                  categoryId: {
                    _id:
                      "6852b4d04ef5f2e4dbd0d020",

                    categoryCode:
                      "CAT001",

                    categoryName:
                      "General Delegates",

                    status: "active",
                  },

                  isAllowed: true,

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
    // Get All Privileges
    // ==========================================

    get: {
      tags: ["Privilege"],

      summary: "Get Event Privileges",

      description:
        "Get all privileges belonging to a specific event.",

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
          name: "sortBy",
          in: "query",

          schema: {
            type: "string",

            enum: [
              "isAllowed",
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
            "Privileges fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Privileges fetched successfully.",

                data: [
                  {
                    _id:
                      "6852b4d04ef5f2e4dbd0d030",

                    eventId: {
                      _id:
                        "6852b4d04ef5f2e4dbd0d003",

                      eventName:
                        "National Convention 2026",

                      eventShortName:
                        "NC2026",
                    },

                    regDataTypeId: {
                      _id:
                        "6852b4d04ef5f2e4dbd0d010",

                      regDataTypeName:
                        "Delegate",
                    },

                    categoryId: {
                      _id:
                        "6852b4d04ef5f2e4dbd0d020",

                      categoryCode:
                        "CAT001",

                      categoryName:
                        "General Delegates",

                      status: "active",
                    },

                    isAllowed: true,

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
  // Get Privilege Matrix
  // ==========================================

  "/events/{eventId}/privileges/matrix": {
    get: {
      tags: ["Privilege"],

      summary: "Get Privilege Matrix",

      description:
        "Get all registration data types, all categories and their allow/block privileges for a specific event.",

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

      responses: {
        200: {
          description:
            "Privilege matrix fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Privilege matrix fetched successfully.",

                data: {
                  regDataTypes: [
                    {
                      _id:
                        "6852b4d04ef5f2e4dbd0d010",

                      regDataTypeName:
                        "Delegate",
                    },
                    {
                      _id:
                        "6852b4d04ef5f2e4dbd0d011",

                      regDataTypeName:
                        "Conference Manager",
                    },
                  ],

                  categories: [
                    {
                      _id:
                        "6852b4d04ef5f2e4dbd0d020",

                      categoryCode:
                        "CAT001",

                      categoryName:
                        "Certificate",

                      status: "active",
                    },
                    {
                      _id:
                        "6852b4d04ef5f2e4dbd0d021",

                      categoryCode:
                        "CAT002",

                      categoryName:
                        "DAY 01 Breakfast",

                      status: "active",
                    },
                  ],

                  privileges: [
                    {
                      _id:
                        "6852b4d04ef5f2e4dbd0d030",

                      regDataTypeId:
                        "6852b4d04ef5f2e4dbd0d010",

                      categoryId:
                        "6852b4d04ef5f2e4dbd0d020",

                      isAllowed: true,
                    },
                    {
                      _id:
                        "6852b4d04ef5f2e4dbd0d031",

                      regDataTypeId:
                        "6852b4d04ef5f2e4dbd0d010",

                      categoryId:
                        "6852b4d04ef5f2e4dbd0d021",

                      isAllowed: false,
                    },
                  ],
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
  // Allow All Categories
  // ==========================================

  "/events/{eventId}/privileges/reg-data-types/{regDataTypeId}/allow-all":
    {
      patch: {
        tags: ["Privilege"],

        summary: "Allow All Categories",

        description:
          "Allow all categories for a specific registration data type within an event.",

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
            name: "regDataTypeId",
            in: "path",
            required: true,

            schema: {
              type: "string",
            },

            example:
              "6852b4d04ef5f2e4dbd0d010",
          },
        ],

        responses: {
          200: {
            description:
              "All categories allowed successfully.",

            content: {
              "application/json": {
                example: {
                  success: true,

                  message:
                    "All categories allowed successfully.",

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

  // ==========================================
  // Block All Categories
  // ==========================================

  "/events/{eventId}/privileges/reg-data-types/{regDataTypeId}/block-all":
    {
      patch: {
        tags: ["Privilege"],

        summary: "Block All Categories",

        description:
          "Block all categories for a specific registration data type within an event.",

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
            name: "regDataTypeId",
            in: "path",
            required: true,

            schema: {
              type: "string",
            },

            example:
              "6852b4d04ef5f2e4dbd0d010",
          },
        ],

        responses: {
          200: {
            description:
              "All categories blocked successfully.",

            content: {
              "application/json": {
                example: {
                  success: true,

                  message:
                    "All categories blocked successfully.",

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

  // ==========================================
  // Get / Update / Delete By ID
  // ==========================================

  "/events/{eventId}/privileges/{id}": {
    // ==========================================
    // Get Privilege By ID
    // ==========================================

    get: {
      tags: ["Privilege"],

      summary: "Get Privilege By ID",

      description:
        "Get a privilege by ID for a specific event.",

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
            "6852b4d04ef5f2e4dbd0d030",
        },
      ],

      responses: {
        200: {
          description:
            "Privilege fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Privilege fetched successfully.",

                data: {
                  _id:
                    "6852b4d04ef5f2e4dbd0d030",

                  eventId: {
                    _id:
                      "6852b4d04ef5f2e4dbd0d003",

                    eventName:
                      "National Convention 2026",

                    eventShortName:
                      "NC2026",
                  },

                  regDataTypeId: {
                    _id:
                      "6852b4d04ef5f2e4dbd0d010",

                    regDataTypeName:
                      "Delegate",
                  },

                  categoryId: {
                    _id:
                      "6852b4d04ef5f2e4dbd0d020",

                    categoryCode:
                      "CAT001",

                    categoryName:
                      "Certificate",

                    status: "active",
                  },

                  isAllowed: true,
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
    // Update Privilege
    // ==========================================

    patch: {
      tags: ["Privilege"],

      summary: "Update Privilege",

      description:
        "Update a privilege for a specific event.",

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
            "6852b4d04ef5f2e4dbd0d030",
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref:
                "#/components/schemas/PrivilegeRequest",
            },

            example: {
              isAllowed: true,
            },
          },
        },
      },

      responses: {
        200: {
          description:
            "Privilege updated successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Privilege updated successfully.",

                data: {
                  _id:
                    "6852b4d04ef5f2e4dbd0d030",

                  eventId: {
                    _id:
                      "6852b4d04ef5f2e4dbd0d003",

                    eventName:
                      "National Convention 2026",

                    eventShortName:
                      "NC2026",
                  },

                  regDataTypeId: {
                    _id:
                      "6852b4d04ef5f2e4dbd0d010",

                    regDataTypeName:
                      "Delegate",
                  },

                  categoryId: {
                    _id:
                      "6852b4d04ef5f2e4dbd0d020",

                    categoryCode:
                      "CAT001",

                    categoryName:
                      "Certificate",

                    status: "active",
                  },

                  isAllowed: true,
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
    // Delete Privilege
    // ==========================================

    delete: {
      tags: ["Privilege"],

      summary: "Delete Privilege",

      description:
        "Delete a privilege belonging to a specific event.",

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
            "6852b4d04ef5f2e4dbd0d030",
        },
      ],

      responses: {
        200: {
          description:
            "Privilege deleted successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Privilege deleted successfully.",

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

export default privilegePaths;