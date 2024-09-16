import { OrbisDB } from "@useorbis/db-sdk";
import config from "./config";
import contexts from "./contexts";
import models from "./models";
import * as mutations from "./mutations";
import * as queries from "./queries";

export const orbisdb = new OrbisDB(config);

export { contexts, models, mutations, queries };
