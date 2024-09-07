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
import { LoaderIcon } from "lucide-react";
import Link from "next/link";

const NavUser = () => {
  const { ready, authenticated, user } = usePrivy();
  const { logout } = useAuth();
  const { profile } = useProfile();
  const email = profile?.email || user?.email?.address || "";

  if (!ready)
    return (
      <Button
        variant="ghost"
        className="relative h-8 cursor-pointer gap-2 rounded-full p-0 hover:bg-transparent"
      >
        <LoaderIcon size={16} className="animate-spin" />
      </Button>
    );

  if (!authenticated) return <SignInButton />;

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
              {profile ? getAvatarInitials(profile.name) : email ? email : "-"}
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
              {email}
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
