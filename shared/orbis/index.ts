import config from "@/app/_providers/orbis/config";
import { OrbisDB } from "@useorbis/db-sdk";

export const orbisdb = new OrbisDB(config);

export const models = {
  profiles: "kjzl6hvfrbw6c9hsegk5w1jwsifgflmm76xux6zq9nxv6bgjktgf3ylb8v56dll",
  posts: "kjzl6hvfrbw6c7cqesoii1hrb9xgzs6d9zf4yygkerzp92ff698oy9ijzpxdugn",
  comments: "kjzl6hvfrbw6c5fy0pa1j9y9dsimgb6ne0jqhneoqaf6t14gb0wbx6ct6qm11ix",
  subscriptions:
    "kjzl6hvfrbw6c5rb6jpq533mct4yeiyubjzf5evf8074urgbzgdwwamwu7dpgwf",
};
