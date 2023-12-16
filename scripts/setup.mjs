import { readFileSync } from "fs";
import { Orbis } from "@orbisclub/components";
import { fromString } from "uint8arrays/from-string";

export const runSetup = async (input) => {
  let parentContext = "";
  let orbis = new Orbis({
    node: "https://node2.orbis.club",
    PINATA_GATEWAY: "https://orbis.mypinata.cloud/ipfs/",
    PINATA_API_KEY: process.env.NEXT_PUBLIC_PINATA_API_KEY,
    PINATA_SECRET_API_KEY: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
  });

  const seed = readFileSync("./admin_seed.txt");
  const key = fromString(seed, "base16");

  const res = await orbis.connectWithSeed(key);
  console.log("orbis connected: ", res);

  const project = await orbis
    .createProject({
      name: input.name || "",
      description: input.description || "",
      image: input.image || "",
      website: input.website || "",
      socials: {
        twitter: input.twitter || "",
        discord: input.discord || "",
        telegram: input.telegram || "",
      },
    })
    .then(async (project) => {
      const context = await orbis
        .createContext({
          name: input.contextName || "",
          project_id: project.doc,
          accessRules: input.contextGate
            ? [
                {
                  type: "did",
                  authorizedUsers: [],
                },
              ]
            : [],
          displayName: input.contextName || "",
          integrations: {},
        })
        .then((context) => {
          parentContext = context.doc;
          if (input.categories.length) {
            input.categories.forEach(async (category) => {
              await orbis.createContext({
                name: category.name,
                context: context.doc,
                project_id: project.doc,
                accessRules: category.gated
                  ? [
                      {
                        type: "did",
                        authorizedUsers: [],
                      },
                    ]
                  : [],
                displayName: category.name,
                integrations: {},
              });
            });
          }
        });
    });
  console.log("This is your parent context: ", parentContext);
};
