export const user = {
  name: "dev_user",
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

export const notification = {
  name: "dev_notification",
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

export const subscription = {
  name: "dev_subscription",
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
    },
    additionalProperties: false,
  },
};

export const category = {
  name: "dev_category",
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

export const tag = {
  name: "dev_category",
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

export const post = {
  name: "dev_post",
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

export const comment = {
  name: "dev_comment",
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
