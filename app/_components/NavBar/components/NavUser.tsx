"use client";

import SignInButton from "@/shared/components/SignInButton";
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
import useProfile from "@/shared/hooks/useProfile";
import { getAvatarInitials } from "@/shared/orbis/utils";
import { usePrivy } from "@privy-io/react-auth";
import { BadgeCheckIcon } from "lucide-react";
import Link from "next/link";

const NavUser = () => {
  const { ready, authenticated } = usePrivy();
  const { logout } = useAuth();
  const { profile } = useProfile();

  if (!ready) return null; // TODO: Add loading UI

  if (!authenticated) return <SignInButton />;

  if (!profile) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 gap-2 rounded-full p-1 hover:bg-transparent"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback className="text-sm">
              {getAvatarInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <span className="inline-flex items-center gap-1 leading-none text-muted-foreground">
            {profile.username}
            {profile.verified && (
              <BadgeCheckIcon className="w-5 fill-gray-700 stroke-white" />
            )}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Notifications</DropdownMenuItem>
          <DropdownMenuItem>Subscriptions</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default NavUser;
