"use client";

import { PropsWithChildren } from "react";
import useAuth from "../hooks/useAuth";
import SignInButton from "./SignInButton";

type Props = { message?: string } & PropsWithChildren;
const AuthGuard = ({ children, message = "You are not signed in." }: Props) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) return children;

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-5">
      <h3 className="font-medium">{message}</h3>
      <SignInButton variant="outline" className="mx-auto" />
    </div>
  );
};
export default AuthGuard;
