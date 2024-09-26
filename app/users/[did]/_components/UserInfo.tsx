import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import useAuth from "@/shared/hooks/useAuth";
import useProfile from "@/shared/hooks/useProfile";
import useUser from "@/shared/hooks/useUser";
import { getAvatarInitials } from "@/shared/lib/utils";
import { isNil } from "lodash-es";
import { BellIcon, BellOffIcon, LoaderIcon } from "lucide-react";

type Props = {
  did: string;
};
const UserInfo = ({ did }: Props) => {
  const { isLoggedIn } = useAuth();
  const { profile } = useProfile();
  const {
    user,
    query,
    subscriptionDataQuery,
    updateSubscriptionMutation,
    updatePostNotificationsMutation,
  } = useUser({ did });
  const {
    subscription,
    subscriberCount = 0,
    subscribedToCount = 0,
  } = subscriptionDataQuery.data || {};

  if (query.isLoading) return <div>Loading...</div>;

  if (!user) return null;

  const { image, name, username } = user;
  const { subscribed, post_notifications } = subscription || {};

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
        {subscriptionDataQuery.isSuccess && !!profile && (
          <>
            <div className="flex h-5 items-center space-x-4 text-sm">
              <div className="flex items-center gap-1">
                {subscribedToCount}
                <span className="text-sm text-neutral-500">Following</span>
              </div>
              <div className="flex items-center gap-1">
                {subscriberCount}
                <span className="text-sm text-neutral-500">
                  Follower
                  {!isNil(subscriberCount) && +subscriberCount > 1 ? "s" : ""}
                </span>
              </div>
            </div>
            {isLoggedIn && !!profile?.controller && (
              <div className="flex w-full justify-between gap-2">
                <Button
                  size="sm"
                  variant={subscribed ? "secondary" : "default"}
                  className="h-8 flex-1"
                  onClick={() => updateSubscriptionMutation.mutate(!subscribed)}
                  loaderProps={{
                    className: subscribed ? "text-neutral-800" : "",
                  }}
                  loading={updateSubscriptionMutation.isPending}
                >
                  {subscribed ? "Unfollow" : "Follow"}
                </Button>
                {subscribed && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      updatePostNotificationsMutation.mutate(
                        !post_notifications,
                      )
                    }
                  >
                    {updatePostNotificationsMutation.isPending ? (
                      <LoaderIcon size={16} className="animate-spin" />
                    ) : post_notifications ? (
                      <BellIcon size={16} className="fill-neutral-700" />
                    ) : (
                      <BellOffIcon size={16} />
                    )}
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default UserInfo;
