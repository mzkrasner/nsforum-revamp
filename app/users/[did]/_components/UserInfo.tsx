import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import useProfile from "@/shared/hooks/useProfile";
import useUser from "@/shared/hooks/useUser";
import { getAvatarInitials } from "@/shared/lib/utils";
import { isNil } from "lodash-es";
import { BellIcon, BellOffIcon } from "lucide-react";

type Props = {
  did: string;
};
const UserInfo = ({ did }: Props) => {
  const { profile } = useProfile();
  const {
    user,
    query,
    updateSubscriptionMutation,
    subscriptionDataQuery,
    isSubscribed,
    subscribedToCount,
    subscriberCount,
  } = useUser({ did });

  if (query.isLoading) return <div>Loading...</div>;

  if (!user) return null;

  const { image, name, username } = user;

  const recieveNotification = false;

  return (
    <div className="mx-auto flex w-fit flex-col items-center gap-5 sm:flex-row">
      <Avatar className="h-32 w-32">
        <AvatarImage src={image} alt="@shadcn" />
        <AvatarFallback>{getAvatarInitials(name)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center gap-2 sm:items-start">
        <div>
          <h3 className="text-2xl font-semibold">{name}</h3>
          <div className="mx-auto flex w-fit items-center justify-start gap-2 text-sm text-neutral-500 sm:m-0">
            @{username}
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
                  Followers
                  {!isNil(subscriberCount) && +subscriberCount > 1 ? "s" : ""}
                </span>
              </div>
            </>
          )}
        </div>
        {subscriptionDataQuery.isSuccess && !!profile && (
          <div className="flex w-full justify-between gap-2">
            <Button
              size="sm"
              variant={isSubscribed ? "secondary" : "default"}
              className="h-8 flex-1"
              onClick={() => updateSubscriptionMutation.mutate(!isSubscribed)}
              loaderProps={{
                className: isSubscribed ? "text-neutral-800" : "",
              }}
              loading={updateSubscriptionMutation.isPending}
            >
              {isSubscribed ? "Unfollow" : "Follow"}
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8">
              {recieveNotification ? (
                <BellIcon size={16} className="fill-neutral-700" />
              ) : (
                <BellOffIcon size={16} />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserInfo;
