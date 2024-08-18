import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import Link from "next/link";

const ProfileInfo = () => {
  return (
    <div className="mx-auto flex w-fit items-center gap-5">
      <Avatar className="h-32 w-32">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="text-2xl font-semibold">Michael Jola-Moses</h3>
          <div className="flex items-center justify-start gap-3 text-neutral-500">
            <span>@jmmike</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-sm"
                >
                  Verify
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Verify this username with your X account
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="flex h-5 items-center space-x-4 text-sm">
          <div className="flex items-center gap-1">
            200
            <span className="text-sm text-neutral-500">Following</span>
          </div>
          <div className="flex items-center gap-1">
            300
            <span className="text-sm text-neutral-500">Followers</span>
          </div>
        </div>
        <Button variant="secondary" size="sm" className="h-8 w-fit" asChild>
          <Link href="/profile/edit">Account settings</Link>
        </Button>
      </div>
    </div>
  );
};
export default ProfileInfo;
