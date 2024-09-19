import axios, { AxiosError } from "axios";
import fs from "fs";
import models from "../models";
import { users } from "../schemas";

const writeFile = (path: string, content: string) => {
  fs.writeFile(path, content, "utf8", (err: unknown) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("File successfully written!");
    }
  });
};

const updateModelVersion = (modelName: string) => {
  const versionRegex = /_v(\d+)$/; // Regex to match "_v" followed by digits at the end

  // Check if the string ends with a version number
  const match = modelName.match(versionRegex);

  if (match) {
    // If a version is found, increment it
    const currentVersion = parseInt(match[1], 10);
    const newVersion = currentVersion + 1;
    return modelName.replace(versionRegex, `_v${newVersion}`);
  } else {
    // If no version is found, append "_v0"
    return `${modelName}_v0`;
  }
};

const syncModels = async () => {
  const seedString = process.env.ORBIS_SEED;
  const newSchemas = { users };
  const newModels: any = {};
  for (const modelName in newSchemas) {
    if (Object.prototype.hasOwnProperty.call(newSchemas, modelName)) {
      const { name, ...rest } =
        newSchemas[modelName as keyof typeof newSchemas];
      const updatedName = updateModelVersion(
        models[modelName as keyof typeof models]?.name || name, // default to name in model.json
      );

      const model = {
        ...rest,
        name: updatedName,
      };
      try {
        const { data } = await axios.post(
          `${process.env.BASE_URL}/api/dev/create-model`,
          {
            model,
            seedString,
          },
        );
        console.log(`Data returned for ${modelName}: `, data);
        if (data.id) {
          newModels[modelName] = { ...data, name: updatedName };
          // console.log(`Model created for: ${modelName}`);
        } else {
          console.log(`Model creation unsuccessful for: ${modelName}`);
        }
      } catch (error) {
        console.log(
          `Error occured while creating model ${modelName}: `,
          (error as AxiosError)?.response?.data || (error as Error)?.message,
        );
      }
    }
  }
  const updatedModels = { ...(models || {}), ...newModels };
  writeFile(
    "shared/orbis/models.ts",
    `
const models = ${JSON.stringify(updatedModels, undefined, 2)} as const;

export default models;
`,
  );
};

export default syncModels;
