import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import useProfile from "@/shared/hooks/useProfile";
import useUser from "@/shared/hooks/useUser";
import { getAvatarInitials } from "@/shared/lib/utils";

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
                  Follower{subscriberCount !== 1 ? "s" : ""}
                </span>
              </div>
            </>
          )}
        </div>
        {subscriptionDataQuery.isSuccess && !!profile && (
          <Button
            size="sm"
            variant={isSubscribed ? "secondary" : "default"}
            className="h-8 w-fit"
            onClick={() => updateSubscriptionMutation.mutate(!isSubscribed)}
            loaderProps={{ className: isSubscribed ? "text-neutral-800" : "" }}
            loading={updateSubscriptionMutation.isPending}
          >
            {isSubscribed ? "Unsubscribe" : "Subscribe"}
          </Button>
        )}
      </div>
    </div>
  );
};
export default UserInfo;
