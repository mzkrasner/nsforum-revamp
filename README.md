# Network Society Forum

A decentralized forum built on OrbisDB

## Getting Started

1. Clone the main branch of this repo.

2. Setup OrbisDB.
   You can either [install locally](https://www.youtube.com/watch?v=8embizFvI-U) or sign up for on shared node [here](https://studio.useorbis.com/).

3. Create a default or root contexts and add it to the [contexts.ts](shared/orbis/contexts.ts) file.

```ts
const contexts = {
  root: "<CONTEXT ID HERE>",
} as const;
```

4. Add an env.local file as described in the [.env.example](.env.example) file.

5. Install dependencies.

```bash
npm install
```

6. Start the app.

```bash
npm run dev
```

7. Create orbisdb models.

```bash
npm run db:sync
```

8. Open [http://localhost:3000](http://localhost:3000) and sign in.

9. Go to the privy dashboard, copy the id of your user and add it to the ADMIN_PRIVY_IDS environment variable as a stringified array. You can also add other admins if you wish.

```bash
ADMIN_PRIVY_IDS='["<YOUR PRIVY USER ID>", "<ANOTHER PRIVY USER ID>"]'
```

10. Every post must have a category, so before trying to create a new post, you should create at least one category here [http://localhost:3000/admin/categories/new](http://localhost:3000/admin/categories/new).

11. You can now create new posts.

## Email Notifications

### Current Setup

We currently use AWS Lambda to handle email notifications. We plan to use an OrbisDB plugin once we move from a shared instance to a dedicated one.

The lambda functions are built and deployed with sst. You can find the code we used repo [here](https://github.com/JM-M/nsforum-sst)

If you wish to use the same setup, you can clone and deploy the sst repo above. You'll have to set the following env variable as the you sst app's url.

```bash
NEXT_PUBLIC_SST_URL=
```

### Set up your own

You can edit the notifySubscribers function in [here](app/posts/actions.ts)

## Models

You can find the schema for all models in the [this file](shared/orbis/schemas/index.ts).

Once created, model schemas cannot be changed. To mitigate this, every model has a "data" field.

```ts
export const modelName = {
  ...
  schema: {
    ...
    properties: {
      ...
      data: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
} as const;
```

Additional fields can be added to an object which would then be stringified and passed to this "data" field. The downside query the data as you would if it were not stringified.

### "Editing" Models

You cant edit a model, but during development you might want to change a model's schema. A script has been setup that allows you to create a new model, simply edit the [schema file](shared/orbis/schemas/index.ts) and run.

```bash
npm run db:sync-models
```

This would update only the models whose schemas have been changed.

### Creating models

Models are defined using the 2020-12 draft (December 2020 version) of the JSON Schema specification. You can check the existing models for examples. The notifications schema has an array of objects.

```ts
...

export const modelName = {
  ...
  schema: {
    ...
    properties: {
      ...
      name: {
        type: "string",
      },
      users: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    additionalProperties: false,
  },
} as const;

// Ensure to add it to the object exported as the default export
const schemas = {
  ...,
  modelName
} as const;

export default schemas;
```

## Using models

The [OrbisDB SDK](https://github.com/OrbisWeb3/db-sdk) has ORM-like method for querying data. There are [utils](shared/orbis/utils.ts) you can use to write queries more generally. For example:

```ts
const data = await findRow({
  model: modelName,
  where: { name: "Lorem ipsum" },
});
```
