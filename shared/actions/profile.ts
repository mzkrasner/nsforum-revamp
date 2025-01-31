"use server";

import { findRow } from "../orbis/utils";
import { Profile } from "../types/profile";

export const fetchCurrentUserProfile = async (reader_did: string) => {
  return await findRow<Profile>({
    model: "users",
    where: { controller: reader_did },
  });
};
