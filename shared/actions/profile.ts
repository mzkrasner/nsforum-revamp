"use server";

import { findRow } from "../orbis/utils";
import { Profile } from "../types/profile";
import { getCurrentPrivyUserId } from "./auth";

export const fetchCurrentUserProfile = async () => {
  const privyId = await getCurrentPrivyUserId();
  if (!privyId) return null;
  return await findRow<Profile>({
    model: "users",
    where: { privy_id: privyId },
  });
};
