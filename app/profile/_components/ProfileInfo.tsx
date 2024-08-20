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
import useProfile from "@/shared/hooks/useProfile";
import { getAvatarInitials } from "@/shared/orbis/utils";
import Link from "next/link";

const ProfileInfo = () => {
  const { profile, query } = useProfile();

  if (query.isLoading) return <div>Loading...</div>
  if (!profile) return null;

  const { image, name, username, followers, following, verified } = profile;

  return (
    <div className="mx-auto flex w-fit items-center gap-5">
      <Avatar className="h-32 w-32">
        <AvatarImage src={image} alt="@shadcn" />
        <AvatarFallback>{getAvatarInitials(name)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="text-2xl font-semibold">{name}</h3>
          <div className="flex items-center justify-start gap-3 text-neutral-500">
            <span>@{username}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-sm"
                  hidden={verified}
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
            {following}
            <span className="text-sm text-neutral-500">Following</span>
          </div>
          <div className="flex items-center gap-1">
            {followers}
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
