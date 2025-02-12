export const users = {
  name: "users",
  version: "2.0",
  interface: false,
  immutableFields: [],
  implements: [],
  accountRelation: {
    type: "list",
  },
  schema: {
    type: "object",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    properties: {
      image: {
        type: "string",
      },
      name: {
        type: "string",
      },
      username: {
        type: "string",
      },
      verified: {
        type: "boolean",
      },
      data: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
} as const;

export const notifications = {
  name: "notifications",
  version: "2.0",
  interface: false,
  immutableFields: [],
  implements: [],
  accountRelation: {
    type: "list",
  },
  schema: {
    type: "object",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    properties: {
      reader_did: {
        type: "string",
      },
      posts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            stream_id: {
              type: "string",
            },
            author_username: {
              type: "string",
            },
            author_did: {
              type: "string",
            },
            title: {
              type: "string",
            },
            preview: {
              type: "string",
            },
          },
          additionalProperties: false,
        },
      },
      comments: {
        type: "array",
        items: {
          type: "object",
          properties: {
            stream_id: {
              type: "string",
            },
            author_username: {
              type: "string",
            },
            author_did: {
              type: "string",
            },
            preview: {
              type: "string",
            },
          },
          additionalProperties: false,
        },
      },
      status: {
        type: "string",
      },
      data: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
} as const;

export const subscriptions = {
  name: "subscriptions",
  version: "2.0",
  interface: false,
  immutableFields: [],
  implements: [],
  accountRelation: {
    type: "list",
  },
  schema: {
    type: "object",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    properties: {
      author_did: {
        type: "string",
      },
      reader_did: {
        type: "string",
      },
      subscribed: {
        type: "boolean",
      },
      post_notifications: {
        type: "boolean",
      },
      data: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
} as const;

export const categories = {
  name: "categories",
  version: "2.0",
  interface: false,
  immutableFields: [],
  implements: [],
  accountRelation: {
    type: "list",
  },
  schema: {
    type: "object",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    properties: {
      name: {
        type: "string",
      },
      description: {
        type: "string",
      },
      data: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
} as const;

export const categorySuggestions = {
  name: "category_suggestions",
  version: "2.0",
  interface: false,
  immutableFields: [],
  implements: [],
  accountRelation: {
    type: "list",
  },
  schema: {
    type: "object",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    properties: {
      name: {
        type: "string",
      },
      description: {
        type: "string",
      },
      status: {
        type: "string",
      },
      data: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
} as const;

export const tags = {
  name: "tags",
  version: "2.0",
  interface: false,
  immutableFields: [],
  implements: [],
  accountRelation: {
    type: "list",
  },
  schema: {
    type: "object",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    properties: {
      name: {
        type: "string",
      },
      description: {
        type: "string",
      },
      data: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
} as const;

export const posts = {
  name: "posts",
  version: "2.0",
  interface: false,
  immutableFields: [],
  implements: [],
  accountRelation: {
    type: "list",
  },
  schema: {
    type: "object",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    properties: {
      slug: {
        type: "string",
      },
      author_username: {
        type: "string",
      },
      preview: {
        type: "string",
      },
      title: {
        type: "string",
      },
      body: {
        type: "string",
      },
      category: {
        type: "string",
      },
      tag_ids: {
        type: "array",
        items: {
          type: "string",
        },
      },
      status: {
        type: "string",
      },
      data: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
} as const;

export const comments = {
  name: "comments",
  version: "2.0",
  interface: false,
  immutableFields: [],
  implements: [],
  accountRelation: {
    type: "list",
  },
  schema: {
    type: "object",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    properties: {
      author_username: {
        type: "string",
      },
      body: {
        type: "string",
      },
      preview: {
        type: "string",
      },
      post_id: {
        type: "string",
      },
      parent_ids: {
        type: "string",
      },
      status: {
        type: "string",
      },
      data: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
} as const;

export const reactions = {
  name: "reactions",
  version: "2.0",
  interface: false,
  immutableFields: [],
  implements: [],
  accountRelation: {
    type: "set",
    fields: ['content_id'],
  },
  schema: {
    type: "object",
    $schema: "https://json-schema.org/draft/2020-12/schema",
    properties: {
      user_id: {
        type: "string",
      },
      content_id: {
        type: "string",
      },
      model: {
        type: "string",
      },
      type: {
        type: "string",
      },
      data: {
        type: "string",
      },
    },
    required: ['content_id'],
    additionalProperties: false,
  },
} as const;

const schemas = {
  users,
  subscriptions,
  notifications,
  tags,
  categories,
  categorySuggestions,
  posts,
  comments,
  reactions,
} as const;

export default schemas;
