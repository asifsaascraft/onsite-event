import {
  success200,
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
// Venue Swagger Paths
// ==========================================

const venuePaths = {

  // ==========================================
  // Create Venue
  // ==========================================

  "/venues": {
    post: {
      tags: ["Venues"],

      summary: "Create Venue",

      description:
        "Create a new venue with venue information and an optional venue photo.",

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

              required: [
                "venueName",
                "country",
                "state",
                "city",
                "address",
                "website",
                "mapLink",
                "uploadVenuePhoto",
              ],

              properties: {
                venueName: {
                  type: "string",
                  example:
                    "Hyderabad International Convention Centre",
                },

                country: {
                  type: "string",
                  example: "India",
                },

                state: {
                  type: "string",
                  example: "Telangana",
                },

                city: {
                  type: "string",
                  example: "Hyderabad",
                },

                address: {
                  type: "string",
                  example:
                    "HITEC City, Hyderabad, Telangana",
                },

                website: {
                  type: "string",
                  example:
                    "https://example.com",
                },

                mapLink: {
                  type: "string",
                  example:
                    "https://maps.google.com/example",
                },

                uploadVenuePhoto: {
                  type: "string",
                  format: "binary",
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

        409: conflict409,

        422: validation422,

        500: internalServer500,
      },
    },

    // ==========================================
    // Get All Venues
    // ==========================================

    get: {
      tags: ["Venues"],

      summary: "Get All Venues",

      description:
        "Get venues with pagination, search, filtering and sorting.",

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
            example: "Hyderabad",
          },
        },

        {
          name: "country",
          in: "query",
          schema: {
            type: "string",
            example: "India",
          },
        },

        {
          name: "state",
          in: "query",
          schema: {
            type: "string",
            example: "Telangana",
          },
        },

        {
          name: "city",
          in: "query",
          schema: {
            type: "string",
            example: "Hyderabad",
          },
        },

        {
          name: "sortBy",
          in: "query",
          schema: {
            type: "string",
            enum: [
              "venueName",
              "country",
              "state",
              "city",
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
            enum: ["asc", "desc"],
            example: "desc",
          },
        },
      ],

      responses: {
        200: {
          description:
            "Venues fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,
                message:
                  "Venues fetched successfully.",
                data: [
                  {
                    _id:
                      "6852b4d04ef5f2e4dbd0d001",

                    venueName:
                      "Hyderabad International Convention Centre",

                    country: "India",

                    state: "Telangana",

                    city: "Hyderabad",

                    address:
                      "HITEC City, Hyderabad, Telangana",

                    website:
                      "https://example.com",

                    mapLink:
                      "https://maps.google.com/example",

                    uploadVenuePhoto:
                      "https://bucket.s3.amazonaws.com/venue-photos/example.jpg",

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
  // Get Venue By ID
  // ==========================================

  "/venues/{id}": {
    get: {
      tags: ["Venues"],

      summary: "Get Venue By ID",

      description:
        "Get a single venue using its MongoDB ID.",

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
            "Venue fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,
                message:
                  "Venue fetched successfully.",

                data: {
                  _id:
                    "6852b4d04ef5f2e4dbd0d001",

                  venueName:
                    "Hyderabad International Convention Centre",

                  country: "India",

                  state: "Telangana",

                  city: "Hyderabad",

                  address:
                    "HITEC City, Hyderabad, Telangana",

                  website:
                    "https://example.com",

                  mapLink:
                    "https://maps.google.com/example",

                  uploadVenuePhoto:
                    "https://bucket.s3.amazonaws.com/venue-photos/example.jpg",
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
    // Update Venue
    // ==========================================

    patch: {
      tags: ["Venues"],

      summary: "Update Venue",

      description:
        "Update venue information and optionally replace the venue photo.",

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
        required: false,

        content: {
          "multipart/form-data": {
            schema: {
              type: "object",

              properties: {
                venueName: {
                  type: "string",
                  example:
                    "Updated Convention Centre",
                },

                country: {
                  type: "string",
                  example: "India",
                },

                state: {
                  type: "string",
                  example: "Telangana",
                },

                city: {
                  type: "string",
                  example: "Hyderabad",
                },

                address: {
                  type: "string",
                  example:
                    "Updated address",
                },

                website: {
                  type: "string",
                  example:
                    "https://example.com",
                },

                mapLink: {
                  type: "string",
                  example:
                    "https://maps.google.com/example",
                },

                uploadVenuePhoto: {
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
            "Venue updated successfully.",

          content: {
            "application/json": {
              example: {
                success: true,
                message:
                  "Venue updated successfully.",
                data: {},
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
    // Delete Venue
    // ==========================================

    delete: {
      tags: ["Venues"],

      summary: "Delete Venue",

      description:
        "Delete a venue and its uploaded photo.",

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
            "Venue deleted successfully.",

          content: {
            "application/json": {
              example: {
                success: true,
                message:
                  "Venue deleted successfully.",
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

export default venuePaths;