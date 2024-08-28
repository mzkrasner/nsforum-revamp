import syncModels from "./sync-models";
import syncRelations from "./sync-relations";

const syncAll = async () => {
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
