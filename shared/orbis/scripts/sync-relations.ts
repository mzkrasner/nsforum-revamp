import axios, { AxiosError } from "axios";
import { isEqual, isNil } from "lodash-es";
import relations, { Relation } from "../schemas/relations";
import { Schema } from "../types";

const fetchOrbisDBSettings = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_ORBIS_NODE_URL}/api/settings`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ORBIS_DB_AUTH_TOKEN}`,
        },
      },
    );
    return data?.settings;
  } catch (error) {
    console.error(
      "Error occured while fetching orbisdb settings: ",
      (error as AxiosError)?.response?.data || (error as Error)?.message,
    );
  }
};

const createRelation = async <T extends keyof Schema, K extends keyof Schema>(
  relation: Omit<Relation<T, K>, "index">,
  relationName: string,
) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_ORBIS_NODE_URL}/api/db/foreign-key`,
      relation,
      {
        headers: {
          Authorization: `Bearer ${process.env.ORBIS_DB_AUTH_TOKEN}`,
        },
      },
    );
    console.log("Data returned from relation creation: ", data);
    if (data?.success === true) {
      console.log("Successfully created relation");
      return data;
    }
  } catch (error) {
    console.log(
      `Error occured while creating relation ${relationName}: `,
      (error as AxiosError)?.response?.data || (error as Error)?.message,
    );
  }
};

const updateRelation = async <T extends keyof Schema, K extends keyof Schema>(
  relation: Relation<T, K> & { index: number },
  relationName: string,
) => {
  try {
    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_ORBIS_NODE_URL}/api/db/foreign-key`,
      relation,
      {
        headers: {
          Authorization: `Bearer ${process.env.ORBIS_DB_AUTH_TOKEN}`,
        },
      },
    );
    // console.log("Data returned from relation update: ", data);
    if (data?.success === false && data?.message === "Relation not found") {
      console.log("Relation update failed, trying to create");
      createRelation(relation, relationName);
    } else {
      console.log("Successfully updated relation");
      return data;
    }
  } catch (error) {
    console.log(
      `Error occured while updating relation ${relationName}: `,
      (error as AxiosError)?.response?.data || (error as Error)?.message,
    );
  }
};

const syncRelations = async () => {
  const settings = await fetchOrbisDBSettings();
  // console.log("Setting relations: ", settings.relations);
  for (const relationName in relations) {
    if (Object.prototype.hasOwnProperty.call(relations, relationName)) {
      const relation: Relation<any, any> =
        relations[relationName as keyof typeof relations];

      const existingRelations: Relation<any, any>[] =
        settings?.relations[relation.table];

      const index = existingRelations?.findIndex((r) => isEqual(r, relation));
      console.log("Index: ", index);
      console.log("Relation: ", relation);
      if (!isNil(index) && index >= 0) {
        console.log("Updating");
        await updateRelation({ ...relation, index }, relationName);
      } else {
        console.log("Creating");
        await createRelation(relation, relationName);
      }
    }
  }
};

export default syncRelations;
