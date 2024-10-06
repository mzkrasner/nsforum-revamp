"use client";

import { PropsWithChildren } from "react";
import useProfile from "../hooks/useProfile";
import AddProfileButton from "./AddProfileButton";

type Props = { message?: string } & PropsWithChildren;
const NoProfileGuard = ({
  children,
  message = "You have not yet added a profile.",
}: Props) => {
  const { profile } = useProfile();

  if (profile?.controller) return children;

  return (
    <div className="m-auto flex flex-col gap-5 text-center text-neutral-500">
      {message}
      <AddProfileButton className="mx-auto" />
    </div>
  );
};
export default NoProfileGuard;
