import { env } from "@/env";
import syncModels from "./sync-models";
import syncRelations from "./sync-relations";

const syncAll = async () => {
  if (!env.ORBIS_DB_AUTH_TOKEN) {
    console.log("ORBIS_DB_AUTH_TOKEN env variable is required");
    return;
  }

  await syncModels();
  await syncRelations();
};

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length >= 2) {
    const [_, mode] = args;
    if (mode === "all") syncAll();
    if (mode === "models") syncModels();
    if (mode === "relations") syncRelations();
  }
}
