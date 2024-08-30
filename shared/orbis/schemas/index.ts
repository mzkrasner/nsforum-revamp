export const users = {
  name: "dev_users",
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
      email: {
        type: "string",
      },
      followers: {
        type: "number",
      },
      following: {
        type: "number",
      },
      verified: {
        type: "boolean",
      },
    },
    additionalProperties: false,
  },
} as const;

export const notifications = {
  name: "dev_notifications",
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
            author_name: {
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
      // comments: {
      //   type: "array",
      //   items: {
      //     type: "string",
      //   },
      // },
      status: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
} as const;

export const subscriptions = {
  name: "dev_subscriptions",
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
    },
    additionalProperties: false,
  },
} as const;

export const categories = {
  name: "dev_categories",
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
    },
    additionalProperties: false,
  },
} as const;

export const tags = {
  name: "dev_tags",
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
    },
    additionalProperties: false,
  },
} as const;

export const posts = {
  name: "dev_posts",
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
      author_name: {
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
      tags: {
        type: "array",
        items: {
          type: "string",
        },
      },
      status: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
} as const;

export const comments = {
  name: "dev_comments",
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
      user: {
        type: "object",
        properties: {
          username: {
            type: "string",
          },
          did: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
      body: {
        type: "string",
      },
      postId: {
        type: "string",
      },
      topParentId: {
        type: "string",
      },
      parentId: {
        type: "string",
      },
      status: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
} as const;

const schemas = {
  users,
  subscriptions,
  notifications,
  tags,
  categories,
  posts,
  comments,
} as const;

export default schemas;
