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

export const contexts = {
  notifications:
    "kjzl6kcym7w8y76bgglzjgwm9j29u3p7j1833crclqohhif7rrknuy76xu4zh0t",
  // "kjzl6kcym7w8y5suub27i2s18qlhtarkum7ylgme53q0uzzqn1nnj8kwv0xzq3j",
};
