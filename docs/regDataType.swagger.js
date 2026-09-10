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

const regDataTypePaths = {
  // ==========================================
  // Create RegDataType
  // ==========================================

  "/events/{eventId}/reg-data-types": {
    post: {
      tags: ["Registration Data Type"],

      summary: "Create Reg Data Type",

      description:
        "Create a registration data type for a specific event. Admin can create for any event. Operator can create only for their assigned event.",

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
              type: "object",

              required: [
                "regDataTypeName",
              ],

              properties: {
                regDataTypeName: {
                  type: "string",
                  example: "Delegate",
                },
              },
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
    // Get All RegDataTypes
    // ==========================================

    get: {
      tags: ["Registration Data Type"],

      summary: "Get Event Reg Data Types",

      description:
        "Get all registration data types belonging to a specific event.",

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
            example: "Delegate",
          },
        },

        {
          name: "sortBy",
          in: "query",
          schema: {
            type: "string",
            enum: [
              "regDataTypeName",
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
            "Reg data types fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,
                message:
                  "Reg data types fetched successfully.",

                data: [
                  {
                    _id:
                      "6852b4d04ef5f2e4dbd0d004",

                    eventId:
                      "6852b4d04ef5f2e4dbd0d003",

                    regDataTypeName:
                      "Delegate",

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
  // Get RegDataType By ID
  // ==========================================

  "/events/{eventId}/reg-data-types/{id}": {
    get: {
      tags: ["Registration Data Type"],

      summary: "Get Reg Data Type By ID",

      description:
        "Get a registration data type by ID for a specific event.",

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
            "6852b4d04ef5f2e4dbd0d004",
        },
      ],

      responses: {
        200: {
          description:
            "Reg data type fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Reg data type fetched successfully.",

                data: {
                  _id:
                    "6852b4d04ef5f2e4dbd0d004",

                  eventId:
                    "6852b4d04ef5f2e4dbd0d003",

                  regDataTypeName:
                    "Delegate",

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
    // Update RegDataType
    // ==========================================

    patch: {
      tags: ["Registration Data Type"],

      summary: "Update Reg Data Type",

      description:
        "Update a registration data type belonging to a specific event.",

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
            "6852b4d04ef5f2e4dbd0d004",
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              type: "object",

              required: [
                "regDataTypeName",
              ],

              properties: {
                regDataTypeName: {
                  type: "string",
                  example: "Delegate Updated",
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description:
            "Reg data type updated successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Reg data type updated successfully.",

                data: {
                  _id:
                    "6852b4d04ef5f2e4dbd0d004",

                  eventId:
                    "6852b4d04ef5f2e4dbd0d003",

                  regDataTypeName:
                    "Delegate Updated",
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
    // Delete RegDataType
    // ==========================================

    delete: {
      tags: ["Registration Data Type"],

      summary: "Delete Reg Data Type",

      description:
        "Delete a registration data type belonging to a specific event.",

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
            "6852b4d04ef5f2e4dbd0d004",
        },
      ],

      responses: {
        200: {
          description:
            "Reg data type deleted successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Reg data type deleted successfully.",

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

export default regDataTypePaths;