import AddProfileButton from "@/shared/components/AddProfileButton";
import SignOutButton from "@/shared/components/SignOutButton";
import useProfile from "@/shared/hooks/useProfile";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { getAvatarInitials } from "../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function NavUser() {
  const [open, setOpen] = useState(false);
  const { profile } = useProfile();
  const { logout, login, isLoggedIn, isConnecting } = useAuth();
  // const { is_admin } = profile || {};

  // Render login button if not connected
  return (
    <>
      {isConnecting ? (
        <LoaderIcon size={16} className="animate-spin" />
      ) : !isLoggedIn && !isConnecting ? (
        <Button variant="ghost" onClick={login} loadingText="">
          Sign In
        </Button>
      ) : (
        <>
          {/* If authenticated but profile is missing a controller, show profile setup */}
          {isLoggedIn && !isConnecting && !profile?.controller ? (
            <div className="flex items-center gap-2">
              <AddProfileButton />
              <SignOutButton />
            </div>
          ) : (
            /* If authenticated and profile exists, show user dropdown */
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 gap-2 rounded-full p-0 hover:bg-transparent"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.image} alt="@shadcn" />
                    <AvatarFallback className="text-[10px]">
                      {profile ? getAvatarInitials(profile.name) : "-"}
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
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" onClick={() => setOpen(false)}>
                      Profile
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      )}
    </>
  );
}

export default NavUser;
