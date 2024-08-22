"use client";

import NoProfileGuard from "@/shared/components/NoProfileGuard";
import SignInButton from "@/shared/components/SignInButton";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import useAuth from "@/shared/hooks/useAuth";
import useProfile from "@/shared/hooks/useProfile";
import { usePrivy } from "@privy-io/react-auth";
import { TabsContent } from "@radix-ui/react-tabs";
import Comments from "./_components/Comments";
import Drafts from "./_components/Drafts";
import Posts from "./_components/Posts";
import ProfileInfo from "./_components/ProfileInfo";

const ProfilePage = () => {
  const { profile } = useProfile();
  const { isLoggedIn } = useAuth();
  const { ready } = usePrivy();

  if (!isLoggedIn)
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-5">
        <h3 className="font-medium">Sign in to view your profile</h3>
        {ready && <SignInButton variant="outline" className="mx-auto block" />}
      </div>
    );

  if (!profile) return <NoProfileGuard />;

  return (
    <div className="pt-10">
      <ProfileInfo />
      <section className="mt-10">
        <Tabs className="mb-5" defaultValue="drafts">
          <TabsList className="mb-3">
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
          <TabsContent value="drafts">
            <Drafts />
          </TabsContent>
          <TabsContent value="posts">
            <Posts />
          </TabsContent>
          <TabsContent value="comments">
            <Comments />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};
export default ProfilePage;
