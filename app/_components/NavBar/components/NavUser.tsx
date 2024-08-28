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
import { getAvatarInitials } from "@/shared/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

const NavUser = () => {
  const { ready, authenticated, user } = usePrivy();
  const { logout } = useAuth();
  const { profile } = useProfile();

  if (!ready) return null; // TODO: Add loading UI

  if (!authenticated) return <SignInButton />;

  const authEmail = user?.email?.address;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 gap-2 rounded-full p-0 hover:bg-transparent"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.image} alt="@shadcn" />
            <AvatarFallback className="text-[10px]">
              {profile
                ? getAvatarInitials(profile.name)
                : authEmail?.length
                  ? authEmail[0].toUpperCase()
                  : "-"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile ? profile.username : "No profile added"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email?.address as string}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
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
