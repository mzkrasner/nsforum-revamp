import config from "@/app/_providers/orbis/config";
import { OrbisDB } from "@useorbis/db-sdk";

export const orbis = new OrbisDB(config);

export const models = {
  profiles: "kjzl6hvfrbw6c9hsegk5w1jwsifgflmm76xux6zq9nxv6bgjktgf3ylb8v56dll",
};
