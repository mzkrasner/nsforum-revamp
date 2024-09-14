"use client";

import AuthGuard from "@/shared/components/AuthGuard";
import NoProfileGuard from "@/shared/components/NoProfileGuard";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import useAuth from "@/shared/hooks/useAuth";
import useProfile from "@/shared/hooks/useProfile";
import { TabsContent } from "@radix-ui/react-tabs";
import Comments from "./_components/Comments";
import Drafts from "./_components/Drafts";
import Posts from "./_components/Posts";
import ProfileInfo from "./_components/ProfileInfo";

const ProfilePage = () => {
  const { profile } = useProfile();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return <AuthGuard />;

  if (!profile) return <NoProfileGuard />;

  return (
    <div className="pt-10">
      <ProfileInfo />
      <section className="mt-10">
        <Tabs className="mb-5" defaultValue="drafts">
          <TabsList className="mx-auto mb-3 flex w-fit sm:mx-0">
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
