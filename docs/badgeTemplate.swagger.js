import {
  badRequest400,
  unauthorized401,
  forbidden403,
  notFound404,
  validation422,
  internalServer500,
} from "./responses.js";

const badgeTemplatePaths = {
  // ==========================================
  // Get Badge Template
  // ==========================================

  "/events/{eventId}/badge-template": {
    get: {
      tags: ["Badge Template"],

      summary: "Get Badge Template",

      description:
        "Get the badge template configuration for a specific event. If no badge template exists, a default badge template is created and returned.",

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
          description: "Badge template fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Badge template fetched successfully.",

                data: {
                  _id: "6852b4d04ef5f2e4dbd0d500",

                  eventId: "6852b4d04ef5f2e4dbd0d003",

                  fields: [
                    {
                      key: "name",
                      label: "Full Name",
                      enabled: true,
                      order: 0,
                      fontSize: 26,
                      fontWeight: "bold",
                      align: "center",
                    },

                    {
                      key: "qr",
                      label: "QR Code",
                      enabled: true,
                      order: 1,
                      fontSize: 80,
                      fontWeight: "normal",
                      align: "center",
                    },

                    {
                      key: "regNum",
                      label: "Reg No",
                      enabled: true,
                      order: 2,
                      fontSize: 13,
                      fontWeight: "bold",
                      align: "center",
                    },

                    {
                      key: "userTypeName",
                      label: "Category",
                      enabled: false,
                      order: 3,
                      fontSize: 14,
                      fontWeight: "normal",
                      align: "center",
                    },

                    {
                      key: "email",
                      label: "Email",
                      enabled: false,
                      order: 4,
                      fontSize: 12,
                      fontWeight: "normal",
                      align: "center",
                    },

                    {
                      key: "mobile",
                      label: "Mobile",
                      enabled: false,
                      order: 5,
                      fontSize: 12,
                      fontWeight: "normal",
                      align: "center",
                    },

                    {
                      key: "mciNumber",
                      label: "IMC Number",
                      enabled: false,
                      order: 6,
                      fontSize: 12,
                      fontWeight: "normal",
                      align: "center",
                    },

                    {
                      key: "city",
                      label: "City",
                      enabled: false,
                      order: 7,
                      fontSize: 12,
                      fontWeight: "normal",
                      align: "center",
                    },

                    {
                      key: "state",
                      label: "State",
                      enabled: false,
                      order: 8,
                      fontSize: 12,
                      fontWeight: "normal",
                      align: "center",
                    },

                    {
                      key: "country",
                      label: "Country",
                      enabled: false,
                      order: 9,
                      fontSize: 12,
                      fontWeight: "normal",
                      align: "center",
                    },

                    {
                      key: "reference",
                      label: "Reference",
                      enabled: false,
                      order: 10,
                      fontSize: 12,
                      fontWeight: "normal",
                      align: "center",
                    },

                    {
                      key: "note",
                      label: "Note",
                      enabled: false,
                      order: 11,
                      fontSize: 12,
                      fontWeight: "normal",
                      align: "center",
                    },
                  ],

                  qrSize: 80,

                  badgeWidthIn: 4,

                  badgeHeightIn: 3,

                  createdAt: "2026-09-29T10:00:00.000Z",

                  updatedAt: "2026-09-29T10:00:00.000Z",
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

    // ==========================================
    // Save Badge Template
    // ==========================================

    put: {
      tags: ["Badge Template"],

      summary: "Save Badge Template",

      description:
        "Create or update the badge template configuration for a specific event.",

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
      // Request Body
      // ==========================================

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              type: "object",

              required: ["fields"],

              properties: {
                fields: {
                  type: "array",

                  description:
                    "Badge fields and their display configuration.",

                  items: {
                    type: "object",

                    required: [
                      "key",
                      "label",
                      "enabled",
                      "order",
                      "fontSize",
                      "fontWeight",
                      "align",
                    ],

                    properties: {
                      key: {
                        type: "string",

                        description:
                          "Unique field key used to identify the badge data.",

                        example: "name",
                      },

                      label: {
                        type: "string",

                        description:
                          "Display label for the badge field.",

                        example: "Full Name",
                      },

                      enabled: {
                        type: "boolean",

                        description:
                          "Whether this field should be displayed on the badge.",

                        example: true,
                      },

                      order: {
                        type: "integer",

                        description:
                          "Display order of the field on the badge.",

                        example: 0,
                      },

                      fontSize: {
                        type: "number",

                        description:
                          "Font size of the field in pixels.",

                        example: 26,
                      },

                      fontWeight: {
                        type: "string",

                        enum: ["normal", "bold"],

                        example: "bold",
                      },

                      align: {
                        type: "string",

                        enum: ["left", "center", "right"],

                        example: "center",
                      },
                    },
                  },

                  example: [
                    {
                      key: "name",
                      label: "Full Name",
                      enabled: true,
                      order: 0,
                      fontSize: 26,
                      fontWeight: "bold",
                      align: "center",
                    },

                    {
                      key: "qr",
                      label: "QR Code",
                      enabled: true,
                      order: 1,
                      fontSize: 80,
                      fontWeight: "normal",
                      align: "center",
                    },

                    {
                      key: "regNum",
                      label: "Reg No",
                      enabled: true,
                      order: 2,
                      fontSize: 13,
                      fontWeight: "bold",
                      align: "center",
                    },

                    {
                      key: "email",
                      label: "Email",
                      enabled: false,
                      order: 4,
                      fontSize: 12,
                      fontWeight: "normal",
                      align: "center",
                    },
                  ],
                },

                qrSize: {
                  type: "number",

                  description: "QR code size in pixels.",

                  example: 80,
                },

                badgeWidthIn: {
                  type: "number",

                  description: "Badge width in inches.",

                  example: 4,
                },

                badgeHeightIn: {
                  type: "number",

                  description: "Badge height in inches.",

                  example: 3,
                },
              },
            },

            example: {
              fields: [
                {
                  key: "name",
                  label: "Full Name",
                  enabled: true,
                  order: 0,
                  fontSize: 26,
                  fontWeight: "bold",
                  align: "center",
                },

                {
                  key: "qr",
                  label: "QR Code",
                  enabled: true,
                  order: 1,
                  fontSize: 80,
                  fontWeight: "normal",
                  align: "center",
                },

                {
                  key: "regNum",
                  label: "Reg No",
                  enabled: true,
                  order: 2,
                  fontSize: 13,
                  fontWeight: "bold",
                  align: "center",
                },

                {
                  key: "userTypeName",
                  label: "Category",
                  enabled: false,
                  order: 3,
                  fontSize: 14,
                  fontWeight: "normal",
                  align: "center",
                },

                {
                  key: "email",
                  label: "Email",
                  enabled: false,
                  order: 4,
                  fontSize: 12,
                  fontWeight: "normal",
                  align: "center",
                },

                {
                  key: "mobile",
                  label: "Mobile",
                  enabled: false,
                  order: 5,
                  fontSize: 12,
                  fontWeight: "normal",
                  align: "center",
                },

                {
                  key: "mciNumber",
                  label: "IMC Number",
                  enabled: false,
                  order: 6,
                  fontSize: 12,
                  fontWeight: "normal",
                  align: "center",
                },

                {
                  key: "city",
                  label: "City",
                  enabled: false,
                  order: 7,
                  fontSize: 12,
                  fontWeight: "normal",
                  align: "center",
                },

                {
                  key: "state",
                  label: "State",
                  enabled: false,
                  order: 8,
                  fontSize: 12,
                  fontWeight: "normal",
                  align: "center",
                },

                {
                  key: "country",
                  label: "Country",
                  enabled: false,
                  order: 9,
                  fontSize: 12,
                  fontWeight: "normal",
                  align: "center",
                },

                {
                  key: "reference",
                  label: "Reference",
                  enabled: false,
                  order: 10,
                  fontSize: 12,
                  fontWeight: "normal",
                  align: "center",
                },

                {
                  key: "note",
                  label: "Note",
                  enabled: false,
                  order: 11,
                  fontSize: 12,
                  fontWeight: "normal",
                  align: "center",
                },
              ],

              qrSize: 80,

              badgeWidthIn: 4,

              badgeHeightIn: 3,
            },
          },
        },
      },

      // ==========================================
      // Responses
      // ==========================================

      responses: {
        // ==========================================
        // 200 - Success
        // ==========================================

        200: {
          description: "Badge template saved successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Badge template saved successfully.",

                data: {
                  _id: "6852b4d04ef5f2e4dbd0d500",

                  eventId: "6852b4d04ef5f2e4dbd0d003",

                  fields: [
                    {
                      key: "name",
                      label: "Full Name",
                      enabled: true,
                      order: 0,
                      fontSize: 26,
                      fontWeight: "bold",
                      align: "center",
                    },

                    {
                      key: "qr",
                      label: "QR Code",
                      enabled: true,
                      order: 1,
                      fontSize: 80,
                      fontWeight: "normal",
                      align: "center",
                    },

                    {
                      key: "regNum",
                      label: "Reg No",
                      enabled: true,
                      order: 2,
                      fontSize: 13,
                      fontWeight: "bold",
                      align: "center",
                    },
                  ],

                  qrSize: 80,

                  badgeWidthIn: 4,

                  badgeHeightIn: 3,

                  createdAt: "2026-09-29T10:00:00.000Z",

                  updatedAt: "2026-09-29T10:05:00.000Z",
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
        // 422 - Validation Error
        // ==========================================

        422: validation422,

        // ==========================================
        // 500 - Internal Server Error
        // ==========================================

        500: internalServer500,
      },
    },
  },
};

export default badgeTemplatePaths;