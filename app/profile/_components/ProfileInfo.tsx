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
import { getAvatarInitials } from "@/shared/lib/utils";
import { LockOpenIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProfileInfo = () => {
  const router = useRouter();

  const {
    profile,
    profileQuery,
    subscriptionDataQuery,
    subscribedToCount,
    subscriberCount,
  } = useProfile();

  if (profileQuery.isLoading) return <div>Loading...</div>;
  if (!profile) return null;

  const { image, name, username, verified } = profile;

  return (
    <div className="mx-auto flex w-fit items-center gap-5">
      <Avatar className="h-32 w-32">
        <AvatarImage src={image} alt="@shadcn" />
        <AvatarFallback>{getAvatarInitials(name)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="text-2xl font-semibold">{name}</h3>
          <div className="flex items-center justify-start gap-2 text-neutral-500">
            <span>@{username}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 text-sm"
                  onClick={() => router.push("/profile/edit#username-lock")}
                  hidden={verified}
                >
                  <LockOpenIcon size={12} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                You can verify your account using your X (formerly twitter)
                account. This allows you to lock your username and react to
                posts <span className="link">Learn more</span>
              </TooltipContent>
            </Tooltip>
            {/* <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 text-sm"
                  hidden={verified}
                  asChild
                >
                  <Link href="/profile/edit#identity-verification">
                    <BadgeHelpIcon size={14} />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Verify your identity. This allows you to react to posts.
              </TooltipContent>
            </Tooltip> */}
          </div>
        </div>
        <div className="flex h-5 items-center space-x-4 text-sm">
          {subscriptionDataQuery.isSuccess && (
            <>
              <div className="flex items-center gap-1">
                {subscribedToCount}
                <span className="text-sm text-neutral-500">Following</span>
              </div>
              <div className="flex items-center gap-1">
                {subscriberCount}
                <span className="text-sm text-neutral-500">
                  Follower{subscriberCount !== 1 ? "s" : ""}
                </span>
              </div>
            </>
          )}
        </div>
        <Button variant="secondary" size="sm" className="h-8 w-fit" asChild>
          <Link href="/profile/edit">Account settings</Link>
        </Button>
      </div>
    </div>
  );
};
export default ProfileInfo;
