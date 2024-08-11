"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import useAuth from "@/shared/hooks/useAuth";
import { usePrivy } from "@privy-io/react-auth";
import { BadgeCheckIcon } from "lucide-react";

const User = () => {
  const { ready, authenticated } = usePrivy();
  const { login, logout } = useAuth();

  if (!ready) return null; // TODO: Add loading UI

  if (!authenticated)
    return (
      <Button variant="ghost" onClick={login}>
        Sign In
      </Button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 gap-2 rounded-full p-1 hover:bg-transparent"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <span className="inline-flex items-center gap-1 text-xs leading-none text-muted-foreground">
            john_doe
            <BadgeCheckIcon className="w-5 fill-gray-700 stroke-white" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default User;
