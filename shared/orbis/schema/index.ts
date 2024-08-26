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
};

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
      user: {
        type: "string",
      },
      title: {
        type: "string",
      },
      body: {
        type: "string",
      },
      type: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
};

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
      author: {
        type: "string",
      },
      reader: {
        type: "string",
      },
      verified: {
        type: "boolean",
      },
    },
    additionalProperties: false,
  },
};

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
};

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
};

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
      metadata: {
        type: "object",
        properties: {
          created_at: {
            type: "string",
          },
          updated_at: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    },
    additionalProperties: false,
  },
};

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
};

const schema = {
  users,
  subscriptions,
  notifications,
  tags,
  categories,
  posts,
  comments,
};

export default schema;
